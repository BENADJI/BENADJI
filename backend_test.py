#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Académie Oftalmo Platform
Tests all backend endpoints with authentication, validation, and error scenarios
"""

import requests
import json
import os
import time
from datetime import datetime

# Get backend URL from frontend .env file
BACKEND_URL = "https://ophtha-learn.preview.emergentagent.com/api"

# Test credentials
ADMIN_EMAIL = "admin@academy.oms-dz.com"
ADMIN_PASSWORD = "admin123"

# Test data
TEST_USER_DATA = {
    "name": "Dr. Marie Dubois",
    "email": f"marie.dubois.{int(time.time())}@test-ophtalmo.fr",
    "password": "SecurePass123!"
}

TEST_COURSE_DATA = {
    "title": "Chirurgie de la Cataracte Avancée",
    "description": "Formation complète sur les techniques modernes de chirurgie de la cataracte",
    "duration": "8 heures",
    "level": "Avancé",
    "price": 299.99,
    "image": "https://example.com/cataract-surgery.jpg"
}

TEST_CAMPUS_DATA = {
    "name": "Campus Test Paris",
    "location": "Paris, France",
    "image": "https://example.com/paris-campus.jpg",
    "description": "Campus de test pour la formation en ophtalmologie à Paris"
}

class APITester:
    def __init__(self):
        self.admin_token = None
        self.user_token = None
        self.test_user_id = None
        self.test_course_id = None
        self.test_enrollment_id = None
        self.results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }

    def log_result(self, test_name, success, message="", response=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if response and not success:
            print(f"   Response: {response.status_code} - {response.text[:200]}")
        
        if success:
            self.results["passed"] += 1
        else:
            self.results["failed"] += 1
            self.results["errors"].append(f"{test_name}: {message}")
        print()

    def test_health_check(self):
        """Test API health check"""
        try:
            response = requests.get(f"{BACKEND_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Health Check", True, f"API is running: {data['message']}")
                else:
                    self.log_result("Health Check", False, "Invalid response format", response)
            else:
                self.log_result("Health Check", False, f"Unexpected status code: {response.status_code}", response)
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")

    def test_admin_login(self):
        """Test admin login"""
        try:
            response = requests.post(f"{BACKEND_URL}/auth/login", json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            })
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.admin_token = data["token"]
                    if data["user"]["role"] == "admin":
                        self.log_result("Admin Login", True, f"Admin logged in: {data['user']['email']}")
                    else:
                        self.log_result("Admin Login", False, f"User role is not admin: {data['user']['role']}")
                else:
                    self.log_result("Admin Login", False, "Missing token or user in response", response)
            else:
                self.log_result("Admin Login", False, f"Login failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Admin Login", False, f"Request error: {str(e)}")

    def test_user_registration(self):
        """Test user registration"""
        try:
            response = requests.post(f"{BACKEND_URL}/auth/register", json=TEST_USER_DATA)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.user_token = data["token"]
                    self.test_user_id = data["user"]["id"]
                    self.log_result("User Registration", True, f"User registered: {data['user']['email']}")
                else:
                    self.log_result("User Registration", False, "Missing token or user in response", response)
            else:
                self.log_result("User Registration", False, f"Registration failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("User Registration", False, f"Request error: {str(e)}")

    def test_duplicate_registration(self):
        """Test duplicate email registration (should fail)"""
        try:
            response = requests.post(f"{BACKEND_URL}/auth/register", json=TEST_USER_DATA)
            
            if response.status_code == 400:
                data = response.json()
                if "already registered" in data.get("detail", "").lower():
                    self.log_result("Duplicate Registration Prevention", True, "Correctly prevented duplicate registration")
                else:
                    self.log_result("Duplicate Registration Prevention", False, f"Wrong error message: {data.get('detail')}")
            else:
                self.log_result("Duplicate Registration Prevention", False, f"Should have returned 400, got: {response.status_code}", response)
        except Exception as e:
            self.log_result("Duplicate Registration Prevention", False, f"Request error: {str(e)}")

    def test_user_login(self):
        """Test user login with registered credentials"""
        try:
            response = requests.post(f"{BACKEND_URL}/auth/login", json={
                "email": TEST_USER_DATA["email"],
                "password": TEST_USER_DATA["password"]
            })
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.user_token = data["token"]  # Update token
                    self.log_result("User Login", True, f"User logged in: {data['user']['email']}")
                else:
                    self.log_result("User Login", False, "Missing token or user in response", response)
            else:
                self.log_result("User Login", False, f"Login failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("User Login", False, f"Request error: {str(e)}")

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            response = requests.post(f"{BACKEND_URL}/auth/login", json={
                "email": "invalid@test.com",
                "password": "wrongpassword"
            })
            
            if response.status_code == 401:
                self.log_result("Invalid Login Prevention", True, "Correctly rejected invalid credentials")
            else:
                self.log_result("Invalid Login Prevention", False, f"Should have returned 401, got: {response.status_code}", response)
        except Exception as e:
            self.log_result("Invalid Login Prevention", False, f"Request error: {str(e)}")

    def test_get_me_authenticated(self):
        """Test get current user info with valid token"""
        if not self.user_token:
            self.log_result("Get Me (Authenticated)", False, "No user token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and data["user"]["email"] == TEST_USER_DATA["email"]:
                    self.log_result("Get Me (Authenticated)", True, f"Retrieved user info: {data['user']['email']}")
                else:
                    self.log_result("Get Me (Authenticated)", False, "Invalid user data returned", response)
            else:
                self.log_result("Get Me (Authenticated)", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Me (Authenticated)", False, f"Request error: {str(e)}")

    def test_get_me_unauthenticated(self):
        """Test get current user info without token (should fail)"""
        try:
            response = requests.get(f"{BACKEND_URL}/auth/me")
            
            if response.status_code in [401, 403]:  # Both are acceptable for unauthenticated
                self.log_result("Get Me (Unauthenticated)", True, "Correctly rejected unauthenticated request")
            else:
                self.log_result("Get Me (Unauthenticated)", False, f"Should have returned 401/403, got: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Me (Unauthenticated)", False, f"Request error: {str(e)}")

    def test_get_courses_public(self):
        """Test getting courses list (public endpoint)"""
        try:
            response = requests.get(f"{BACKEND_URL}/courses")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Courses (Public)", True, f"Retrieved {len(data)} courses")
                    # Store first course ID for later tests
                    if data:
                        # Check both 'id' and '_id' fields
                        course_id = data[0].get("id") or data[0].get("_id")
                        if course_id:
                            self.test_course_id = course_id
                else:
                    self.log_result("Get Courses (Public)", False, "Response is not a list", response)
            else:
                self.log_result("Get Courses (Public)", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Courses (Public)", False, f"Request error: {str(e)}")

    def test_get_course_by_id_valid(self):
        """Test getting a specific course by valid ID"""
        if not self.test_course_id:
            self.log_result("Get Course by Valid ID", False, "No course ID available from previous test")
            return
            
        try:
            response = requests.get(f"{BACKEND_URL}/courses/{self.test_course_id}")
            
            if response.status_code == 200:
                data = response.json()
                # Check both 'id' and '_id' fields
                course_id = data.get("id") or data.get("_id")
                if course_id and "title" in data:
                    self.log_result("Get Course by Valid ID", True, f"Retrieved course: {data['title']}")
                else:
                    self.log_result("Get Course by Valid ID", False, "Invalid course data structure", response)
            else:
                self.log_result("Get Course by Valid ID", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Course by Valid ID", False, f"Request error: {str(e)}")

    def test_get_course_by_id_invalid(self):
        """Test getting a course with invalid ID"""
        try:
            response = requests.get(f"{BACKEND_URL}/courses/invalid_id_123")
            
            if response.status_code == 400:
                self.log_result("Get Course by Invalid ID", True, "Correctly rejected invalid course ID")
            else:
                self.log_result("Get Course by Invalid ID", False, f"Should have returned 400, got: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Course by Invalid ID", False, f"Request error: {str(e)}")

    def test_get_course_by_id_nonexistent(self):
        """Test getting a course with valid but non-existent ID"""
        try:
            # Use a valid ObjectId format but non-existent
            fake_id = "507f1f77bcf86cd799439011"
            response = requests.get(f"{BACKEND_URL}/courses/{fake_id}")
            
            if response.status_code == 404:
                self.log_result("Get Course by Non-existent ID", True, "Correctly returned 404 for non-existent course")
            else:
                self.log_result("Get Course by Non-existent ID", False, f"Should have returned 404, got: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Course by Non-existent ID", False, f"Request error: {str(e)}")

    def test_create_course_admin(self):
        """Test creating a course as admin"""
        if not self.admin_token:
            self.log_result("Create Course (Admin)", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.post(f"{BACKEND_URL}/courses", json=TEST_COURSE_DATA, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                # Check both 'id' and '_id' fields
                course_id = data.get("id") or data.get("_id")
                if course_id and "title" in data:
                    self.test_course_id = course_id  # Update for enrollment tests
                    self.log_result("Create Course (Admin)", True, f"Created course: {data['title']}")
                else:
                    self.log_result("Create Course (Admin)", False, "Invalid course data returned", response)
            else:
                self.log_result("Create Course (Admin)", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Create Course (Admin)", False, f"Request error: {str(e)}")

    def test_create_course_non_admin(self):
        """Test creating a course as non-admin user (should fail)"""
        if not self.user_token:
            self.log_result("Create Course (Non-Admin)", False, "No user token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = requests.post(f"{BACKEND_URL}/courses", json=TEST_COURSE_DATA, headers=headers)
            
            if response.status_code == 403:
                self.log_result("Create Course (Non-Admin)", True, "Correctly rejected non-admin course creation")
            else:
                self.log_result("Create Course (Non-Admin)", False, f"Should have returned 403, got: {response.status_code}", response)
        except Exception as e:
            self.log_result("Create Course (Non-Admin)", False, f"Request error: {str(e)}")

    def test_enroll_in_course(self):
        """Test enrolling in a course"""
        if not self.user_token or not self.test_course_id:
            self.log_result("Enroll in Course", False, "Missing user token or course ID")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = requests.post(f"{BACKEND_URL}/enrollments", 
                                   json={"course_id": self.test_course_id}, 
                                   headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "enrollment" in data:
                    # Check both 'id' and '_id' fields
                    enrollment_id = data["enrollment"].get("id") or data["enrollment"].get("_id")
                    if enrollment_id:
                        self.test_enrollment_id = enrollment_id
                        self.log_result("Enroll in Course", True, f"Successfully enrolled: {data['message']}")
                    else:
                        self.log_result("Enroll in Course", False, f"No enrollment ID found in response: {data['enrollment']}", response)
                else:
                    self.log_result("Enroll in Course", False, "Invalid enrollment response", response)
            else:
                self.log_result("Enroll in Course", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Enroll in Course", False, f"Request error: {str(e)}")

    def test_duplicate_enrollment(self):
        """Test enrolling in the same course twice (should fail)"""
        if not self.user_token or not self.test_course_id:
            self.log_result("Duplicate Enrollment Prevention", False, "Missing user token or course ID")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = requests.post(f"{BACKEND_URL}/enrollments", 
                                   json={"course_id": self.test_course_id}, 
                                   headers=headers)
            
            if response.status_code == 400:
                data = response.json()
                if "already enrolled" in data.get("detail", "").lower():
                    self.log_result("Duplicate Enrollment Prevention", True, "Correctly prevented duplicate enrollment")
                else:
                    self.log_result("Duplicate Enrollment Prevention", False, f"Wrong error message: {data.get('detail')}")
            else:
                self.log_result("Duplicate Enrollment Prevention", False, f"Should have returned 400, got: {response.status_code}", response)
        except Exception as e:
            self.log_result("Duplicate Enrollment Prevention", False, f"Request error: {str(e)}")

    def test_get_my_courses(self):
        """Test getting user's enrolled courses"""
        if not self.user_token:
            self.log_result("Get My Courses", False, "No user token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = requests.get(f"{BACKEND_URL}/enrollments/my-courses", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get My Courses", True, f"Retrieved {len(data)} enrolled courses")
                else:
                    self.log_result("Get My Courses", False, "Response is not a list", response)
            else:
                self.log_result("Get My Courses", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get My Courses", False, f"Request error: {str(e)}")

    def test_update_progress(self):
        """Test updating course progress"""
        if not self.user_token or not self.test_enrollment_id:
            self.log_result("Update Progress", False, "Missing user token or enrollment ID")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = requests.put(f"{BACKEND_URL}/enrollments/{self.test_enrollment_id}/progress", 
                                  json={"progress": 50}, 
                                  headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "progress" in data and data["progress"] == 50:
                    self.log_result("Update Progress", True, f"Updated progress to {data['progress']}%")
                else:
                    self.log_result("Update Progress", False, "Progress not updated correctly", response)
            else:
                self.log_result("Update Progress", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Update Progress", False, f"Request error: {str(e)}")

    def test_get_stats_public(self):
        """Test getting statistics (public endpoint)"""
        try:
            response = requests.get(f"{BACKEND_URL}/stats")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["webinar_listeners", "virtual_classes", "key_opinion_leaders", "subscribers"]
                if all(field in data for field in required_fields):
                    self.log_result("Get Stats (Public)", True, f"Retrieved stats: {data['webinar_listeners']} listeners")
                else:
                    self.log_result("Get Stats (Public)", False, "Missing required fields in stats", response)
            else:
                self.log_result("Get Stats (Public)", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Stats (Public)", False, f"Request error: {str(e)}")

    def test_update_stats_admin(self):
        """Test updating statistics as admin"""
        if not self.admin_token:
            self.log_result("Update Stats (Admin)", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            new_stats = {
                "webinar_listeners": 3000,
                "virtual_classes": 200,
                "key_opinion_leaders": 50,
                "subscribers": 9000
            }
            response = requests.put(f"{BACKEND_URL}/stats", json=new_stats, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data["webinar_listeners"] == 3000:
                    self.log_result("Update Stats (Admin)", True, f"Updated stats: {data['webinar_listeners']} listeners")
                else:
                    self.log_result("Update Stats (Admin)", False, "Stats not updated correctly", response)
            else:
                self.log_result("Update Stats (Admin)", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Update Stats (Admin)", False, f"Request error: {str(e)}")

    def test_get_campuses_public(self):
        """Test getting campuses (public endpoint)"""
        try:
            response = requests.get(f"{BACKEND_URL}/campuses")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) >= 2:
                    self.log_result("Get Campuses (Public)", True, f"Retrieved {len(data)} campuses")
                else:
                    self.log_result("Get Campuses (Public)", False, f"Expected at least 2 campuses, got {len(data) if isinstance(data, list) else 'invalid data'}", response)
            else:
                self.log_result("Get Campuses (Public)", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Campuses (Public)", False, f"Request error: {str(e)}")

    def test_create_campus_admin(self):
        """Test creating a campus as admin"""
        if not self.admin_token:
            self.log_result("Create Campus (Admin)", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.post(f"{BACKEND_URL}/campuses", json=TEST_CAMPUS_DATA, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                # Check both 'id' and '_id' fields
                campus_id = data.get("id") or data.get("_id")
                if campus_id and "name" in data:
                    self.log_result("Create Campus (Admin)", True, f"Created campus: {data['name']}")
                else:
                    self.log_result("Create Campus (Admin)", False, "Invalid campus data returned", response)
            else:
                self.log_result("Create Campus (Admin)", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Create Campus (Admin)", False, f"Request error: {str(e)}")

    def test_get_admin_users(self):
        """Test getting all users (admin endpoint)"""
        if not self.admin_token:
            self.log_result("Get Admin Users", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{BACKEND_URL}/admin/users", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Admin Users", True, f"Retrieved {len(data)} users")
                else:
                    self.log_result("Get Admin Users", False, "Response is not a list", response)
            else:
                self.log_result("Get Admin Users", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Admin Users", False, f"Request error: {str(e)}")

    def test_get_admin_dashboard(self):
        """Test getting admin dashboard stats"""
        if not self.admin_token:
            self.log_result("Get Admin Dashboard", False, "No admin token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{BACKEND_URL}/admin/dashboard", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_users", "total_courses", "total_enrollments", "total_students", "total_admins"]
                if all(field in data for field in required_fields):
                    self.log_result("Get Admin Dashboard", True, f"Retrieved dashboard: {data['total_users']} users, {data['total_courses']} courses")
                else:
                    self.log_result("Get Admin Dashboard", False, "Missing required fields in dashboard", response)
            else:
                self.log_result("Get Admin Dashboard", False, f"Failed with status: {response.status_code}", response)
        except Exception as e:
            self.log_result("Get Admin Dashboard", False, f"Request error: {str(e)}")

    def test_admin_endpoints_non_admin(self):
        """Test admin endpoints with non-admin user (should fail)"""
        if not self.user_token:
            self.log_result("Admin Endpoints (Non-Admin)", False, "No user token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            
            # Test admin users endpoint
            response = requests.get(f"{BACKEND_URL}/admin/users", headers=headers)
            if response.status_code != 403:
                self.log_result("Admin Endpoints (Non-Admin)", False, f"Admin users endpoint should return 403, got: {response.status_code}", response)
                return
            
            # Test admin dashboard endpoint
            response = requests.get(f"{BACKEND_URL}/admin/dashboard", headers=headers)
            if response.status_code != 403:
                self.log_result("Admin Endpoints (Non-Admin)", False, f"Admin dashboard endpoint should return 403, got: {response.status_code}", response)
                return
            
            self.log_result("Admin Endpoints (Non-Admin)", True, "Correctly rejected non-admin access to admin endpoints")
            
        except Exception as e:
            self.log_result("Admin Endpoints (Non-Admin)", False, f"Request error: {str(e)}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 80)
        print("🧪 ACADÉMIE OFTALMO BACKEND API TEST SUITE")
        print("=" * 80)
        print(f"Testing backend at: {BACKEND_URL}")
        print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        print()

        # Health and basic connectivity
        self.test_health_check()
        
        # Authentication tests
        self.test_admin_login()
        self.test_user_registration()
        self.test_duplicate_registration()
        self.test_user_login()
        self.test_invalid_login()
        self.test_get_me_authenticated()
        self.test_get_me_unauthenticated()
        
        # Course management tests
        self.test_get_courses_public()
        self.test_get_course_by_id_valid()
        self.test_get_course_by_id_invalid()
        self.test_get_course_by_id_nonexistent()
        self.test_create_course_admin()
        self.test_create_course_non_admin()
        
        # Enrollment tests
        self.test_enroll_in_course()
        self.test_duplicate_enrollment()
        self.test_get_my_courses()
        self.test_update_progress()
        
        # Statistics tests
        self.test_get_stats_public()
        self.test_update_stats_admin()
        
        # Campus tests
        self.test_get_campuses_public()
        self.test_create_campus_admin()
        
        # Admin tests
        self.test_get_admin_users()
        self.test_get_admin_dashboard()
        self.test_admin_endpoints_non_admin()
        
        # Print summary
        print("=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📈 Success Rate: {(self.results['passed'] / (self.results['passed'] + self.results['failed']) * 100):.1f}%")
        
        if self.results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        print("=" * 80)
        return self.results['failed'] == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)