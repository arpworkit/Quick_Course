'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check authentication and load user data
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const parsedUser = JSON.parse(userData);

        // Check if user has Student role
        if (parsedUser.role && parsedUser.role !== 'Student') {
          router.push('/login');
          return;
        }

        setUser(parsedUser);

        // Load enrolled courses from localStorage for this specific user
        const userEmail = parsedUser.email;
        const enrolledData = localStorage.getItem(`enrolledCourses_${userEmail}`);
        if (enrolledData) {
          setEnrolledCourses(JSON.parse(enrolledData));
        }

        // Fetch available courses from API
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          const courses = data.courses || [];
          setAvailableCourses(courses);
          setFilteredCourses(courses);
        } else {
          console.error('Failed to fetch courses');
          setAvailableCourses([]);
          setFilteredCourses([]);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  // Filter courses based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCourses(availableCourses);
    } else {
      const filtered = availableCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, availableCourses]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleEnroll = async (course) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: course.id,
          courseName: course.title,
          instructor: course.instructor
        })
      });

      if (response.ok) {
        const newEnrolledCourses = [...enrolledCourses, course];
        setEnrolledCourses(newEnrolledCourses);
        const userEmail = user.email;
        localStorage.setItem(`enrolledCourses_${userEmail}`, JSON.stringify(newEnrolledCourses));
        alert(`Successfully enrolled in ${course.title} by ${course.instructor}!`);
      } else {
        const errorData = await response.json();
        alert(`Enrollment failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Enrollment failed. Please try again.');
    }
  };

  const handleViewDetails = (course) => {
    // Store course data in localStorage for the details page
    localStorage.setItem(`courseDetails_${course.id}`, JSON.stringify(course));

    // Navigate to course details page
    router.push(`/course-details?id=${course.id}`);
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="header">
        <Image
          src="/icons/rezoomex_logo_1000w 1.png"
          alt="Rezoomex Logo"
          width={116}
          height={44}
          className="header-logo"
        />
        <div className="header-buttons">
          <div className="user-profile">
            <svg className="user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C12.7417 3 13.4667 3.21993 14.0834 3.63199C14.7001 4.04404 15.1807 4.62971 15.4645 5.31494C15.7484 6.00016 15.8226 6.75416 15.6779 7.48159C15.5333 8.20902 15.1761 8.8772 14.6517 9.40165C14.1272 9.9261 13.459 10.2833 12.7316 10.4279C12.0042 10.5726 11.2502 10.4984 10.5649 10.2145C9.87971 9.93072 9.29404 9.45007 8.88199 8.83339C8.46993 8.2167 8.25 7.49168 8.25 6.75C8.25 5.75544 8.64509 4.80161 9.34835 4.09835C10.0516 3.39509 11.0054 3 12 3ZM12 1.5C10.9616 1.5 9.94661 1.80791 9.08326 2.38478C8.2199 2.96166 7.54699 3.7816 7.14963 4.74091C6.75227 5.70022 6.64831 6.75582 6.85088 7.77422C7.05345 8.79262 7.55346 9.72808 8.28769 10.4623C9.02192 11.1965 9.95738 11.6966 10.9758 11.8991C11.9942 12.1017 13.0498 11.9977 14.0091 11.6004C14.9684 11.203 15.7883 10.5301 16.3652 9.66674C16.9421 8.80339 17.25 7.78835 17.25 6.75C17.25 5.35761 16.6969 4.02226 15.7123 3.03769C14.7277 2.05312 13.3924 1.5 12 1.5Z" fill="#161616"/>
              <path d="M19.5 22.5H18V18.75C18 18.2575 17.903 17.7699 17.7145 17.3149C17.5261 16.86 17.2499 16.4466 16.9017 16.0983C16.5534 15.7501 16.14 15.4739 15.6851 15.2855C15.2301 15.097 14.7425 15 14.25 15H9.75C8.75544 15 7.80161 15.3951 7.09835 16.0983C6.39509 16.8016 6 17.7554 6 18.75V22.5H4.5V18.75C4.5 17.3576 5.05312 16.0223 6.03769 15.0377C7.02226 14.0531 8.35761 13.5 9.75 13.5H14.25C15.6424 13.5 16.9777 14.0531 17.9623 15.0377C18.9469 16.0223 19.5 17.3576 19.5 18.75V22.5Z" fill="#161616"/>
            </svg>
            <span className="user-name">{user.fullName}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <svg className="logout-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4.5 22.5H13.5C13.8977 22.4995 14.279 22.3414 14.5602 22.0602C14.8414 21.7789 14.9995 21.3977 15 21V18.75H13.5V21H4.5V3H13.5V5.25H15V3C14.9995 2.60232 14.8414 2.22105 14.5602 1.93984C14.279 1.65864 13.8977 1.50046 13.5 1.5H4.5C4.10232 1.50046 3.72105 1.65864 3.43984 1.93984C3.15864 2.22105 3.00046 2.60232 3 3V21C3.00046 21.3977 3.15864 21.7789 3.43984 22.0602C3.72105 22.3414 4.10232 22.4995 4.5 22.5Z" fill="#161616"/>
              <path d="M15.4395 15.4395L18.129 12.75H7.5V11.25H18.129L15.4395 8.5605L16.5 7.5L21 12L16.5 16.5L15.4395 15.4395Z" fill="#161616"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="school-name">
          <h1>Rezoomex School</h1>
        </div>

        <div className="welcome-section">
          <h2 className="welcome-title">Welcome back {user.fullName.split(' ')[0]}!</h2>
          <p className="welcome-subtitle">Manage your courses and track student progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="65" height="65" viewBox="0 0 65 65" fill="none">
                <circle cx="32.5" cy="32.5" r="32.5" fill="#1B7EB0" fillOpacity="0.12"/>
              </svg>
              <svg className="icon-overlay" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M29.25 11.25H21.375V13.5H29.25V11.25Z" fill="#2375AB"/>
                <path d="M29.25 16.875H21.375V19.125H29.25V16.875Z" fill="#2375AB"/>
                <path d="M29.25 22.5H21.375V24.75H29.25V22.5Z" fill="#2375AB"/>
                <path d="M14.625 11.25H6.75V13.5H14.625V11.25Z" fill="#2375AB"/>
                <path d="M14.625 16.875H6.75V19.125H14.625V16.875Z" fill="#2375AB"/>
                <path d="M14.625 22.5H6.75V24.75H14.625V22.5Z" fill="#2375AB"/>
                <path d="M31.5 5.625H4.5C3.90345 5.6256 3.3315 5.86284 2.90967 6.28467C2.48784 6.7065 2.2506 7.27845 2.25 7.875V28.125C2.2506 28.7216 2.48784 29.2935 2.90967 29.7153C3.3315 30.1372 3.90345 30.3744 4.5 30.375H31.5C32.0966 30.3744 32.6685 30.1372 33.0903 29.7153C33.5122 29.2935 33.7494 28.7216 33.75 28.125V7.875C33.7494 7.27845 33.5122 6.7065 33.0903 6.28467C32.6685 5.86284 32.0966 5.6256 31.5 5.625ZM4.5 7.875H16.875V28.125H4.5V7.875ZM19.125 28.125V7.875H31.5V28.125H19.125Z" fill="#2375AB"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Total Course</h3>
              <p className="stat-number">{availableCourses.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="65" height="65" viewBox="0 0 65 65" fill="none">
                <circle cx="32.5" cy="32.5" r="32.5" fill="#1B7EB0" fillOpacity="0.12"/>
              </svg>
              <svg className="icon-overlay" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M11.25 33.75C12.4926 33.75 13.5 32.7426 13.5 31.5C13.5 30.2574 12.4926 29.25 11.25 29.25C10.0074 29.25 9 30.2574 9 31.5C9 32.7426 10.0074 33.75 11.25 33.75Z" fill="#106197"/>
                <path d="M27 33.75C28.2426 33.75 29.25 32.7426 29.25 31.5C29.25 30.2574 28.2426 29.25 27 29.25C25.7574 29.25 24.75 30.2574 24.75 31.5C24.75 32.7426 25.7574 33.75 27 33.75Z" fill="#106197"/>
                <path d="M5.60317 3.15439C5.55217 2.89936 5.41439 2.66988 5.21326 2.50499C5.01213 2.3401 4.76008 2.25 4.5 2.25H0V4.5H3.5775L7.89683 26.0956C7.94783 26.3506 8.08561 26.5801 8.28674 26.745C8.48787 26.9099 8.73992 27 9 27H29.25V24.75H9.9225L9.0225 20.25H29.25C29.506 20.25 29.7543 20.1627 29.9539 20.0026C30.1536 19.8424 30.2927 19.619 30.3482 19.3691L32.9001 7.875H30.5967L28.348 18H8.5725L5.60317 3.15439Z" fill="#106197"/>
                <path d="M24.2843 7.40925L20.25 11.4435V2.25H18V11.4435L13.9657 7.40925L12.375 9L19.125 15.75L25.875 9L24.2843 7.40925Z" fill="#106197"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Enrolled courses</h3>
              <p className="stat-number">{enrolledCourses.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="65" height="65" viewBox="0 0 65 65" fill="none">
                <circle cx="32.5" cy="32.5" r="32.5" fill="#1B7EB0" fillOpacity="0.12"/>
              </svg>
              <svg className="icon-overlay" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 4.5C19.1125 4.5 20.2001 4.8299 21.1251 5.44798C22.0501 6.06607 22.7711 6.94457 23.1968 7.97241C23.6226 9.00024 23.734 10.1312 23.5169 11.2224C23.2999 12.3135 22.7641 13.3158 21.9775 14.1025C21.1908 14.8891 20.1885 15.4249 19.0974 15.6419C18.0062 15.859 16.8752 15.7476 15.8474 15.3218C14.8196 14.8961 13.9411 14.1751 13.323 13.2501C12.7049 12.3251 12.375 11.2375 12.375 10.125C12.375 8.63316 12.9676 7.20242 14.0225 6.14752C15.0774 5.09263 16.5082 4.5 18 4.5ZM18 2.25C16.4425 2.25 14.9199 2.71186 13.6249 3.57718C12.3298 4.44249 11.3205 5.6724 10.7244 7.11137C10.1284 8.55034 9.97246 10.1337 10.2763 11.6613C10.5802 13.1889 11.3302 14.5921 12.4315 15.6935C13.5329 16.7948 14.9361 17.5448 16.4637 17.8487C17.9913 18.1525 19.5747 17.9966 21.0136 17.4006C22.4526 16.8045 23.6825 15.7952 24.5478 14.5001C25.4131 13.2051 25.875 11.6825 25.875 10.125C25.875 8.03642 25.0453 6.03338 23.5685 4.55653C22.0916 3.07969 20.0886 2.25 18 2.25Z" fill="#106197"/>
                <path d="M29.25 33.75H27V28.125C27 27.3863 26.8545 26.6549 26.5718 25.9724C26.2891 25.2899 25.8748 24.6699 25.3525 24.1475C24.8301 23.6252 24.2101 23.2109 23.5276 22.9282C22.8451 22.6455 22.1137 22.5 21.375 22.5H14.625C13.1332 22.5 11.7024 23.0926 10.6475 24.1475C9.59263 25.2024 9 26.6332 9 28.125V33.75H6.75V28.125C6.75 26.0364 7.57969 24.0334 9.05653 22.5565C10.5334 21.0797 12.5364 20.25 14.625 20.25H21.375C23.4636 20.25 25.4666 21.0797 26.9435 22.5565C28.4203 24.0334 29.25 26.0364 29.25 28.125V33.75Z" fill="#106197"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Your Role</h3>
              <p className="stat-role">Student</p>
            </div>
          </div>
        </div>

        {/* Course Sections */}
        <div className="courses-section">
          <h2 className="section-title">Your Course</h2>

          {/* Enrolled Courses Section */}
          {enrolledCourses.length > 0 && (
            <div className="enrolled-courses-section">
              <h3 className="subsection-title">Enrolled Courses</h3>
              <div className="courses-grid">
                {enrolledCourses.map((course) => (
                  <div key={`enrolled-${course.id}`} className="course-card enrolled-course">
                    <div className="course-header">
                      <svg className="course-icon" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M36 45H12C11.2046 44.9991 10.4421 44.6827 9.87969 44.1203C9.31728 43.5579 9.00091 42.7954 9 42V6C9.00079 5.20459 9.31712 4.44199 9.87956 3.87956C10.442 3.31712 11.2046 3.00079 12 3H36C36.7954 3.00091 37.5579 3.31728 38.1203 3.87969C38.6827 4.4421 38.9991 5.20463 39 6V30.9273L31.5 27.1773L24 30.9273V6H12V42H36V36H39V42C38.9989 42.7953 38.6825 43.5578 38.1201 44.1201C37.5578 44.6825 36.7953 44.9989 36 45ZM31.5 23.8227L36 26.0727V6H27V26.0727L31.5 23.8227Z" fill="#F4F4F4"/>
                      </svg>
                      <div className="enrolled-badge">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#FFF"/>
                        </svg>
                      </div>
                    </div>

                    <div className="course-content">
                      <h4 className="course-title">{course.title}</h4>

                      <div className="course-instructor">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 2C8.49445 2 8.9778 2.14662 9.38893 2.42133C9.80005 2.69603 10.1205 3.08648 10.3097 3.54329C10.4989 4.00011 10.5484 4.50277 10.452 4.98773C10.3555 5.47268 10.1174 5.91814 9.76777 6.26777C9.41814 6.6174 8.97268 6.8555 8.48773 6.95196C8.00277 7.04843 7.50011 6.99892 7.04329 6.8097C6.58648 6.62048 6.19603 6.30005 5.92133 5.88893C5.64662 5.4778 5.5 4.99445 5.5 4.5C5.5 3.83696 5.76339 3.20107 6.23223 2.73223C6.70107 2.26339 7.33696 2 8 2ZM8 1C7.30777 1 6.63108 1.20527 6.0555 1.58986C5.47993 1.97444 5.03133 2.52107 4.76642 3.16061C4.50152 3.80015 4.4322 4.50388 4.56725 5.18282C4.7023 5.86175 5.03564 6.48539 5.52513 6.97487C6.01461 7.46436 6.63825 7.7977 7.31718 7.93275C7.99612 8.0678 8.69985 7.99849 9.33939 7.73358C9.97893 7.46867 10.5256 7.02007 10.9101 6.4445C11.2947 5.86892 11.5 5.19223 11.5 4.5C11.5 3.57174 11.1313 2.6815 10.4749 2.02513C9.8185 1.36875 8.92826 1 8 1Z" fill="#8D8D8D"/>
                          <path d="M13 15H12V12.5C12 12.1717 11.9353 11.8466 11.8097 11.5433C11.6841 11.24 11.4999 10.9644 11.2678 10.7322C11.0356 10.5001 10.76 10.3159 10.4567 10.1903C10.1534 10.0647 9.8283 10 9.5 10H6.5C5.83696 10 5.20107 10.2634 4.73223 10.7322C4.26339 11.2011 4 11.837 4 12.5V15H3V12.5C3 11.5717 3.36875 10.6815 4.02513 10.0251C4.6815 9.36875 5.57174 9 6.5 9H9.5C10.4283 9 11.3185 9.36875 11.9749 10.0251C12.6313 10.6815 13 11.5717 13 12.5V15Z" fill="#8D8D8D"/>
                        </svg>
                        <span>{course.instructor}</span>
                      </div>

                      <p className="course-description">{course.description}</p>

                      <div className="course-price">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 3.5V2.5H4V3.5H6.75C7.30183 3.50169 7.83372 3.70653 8.24413 4.07544C8.65453 4.44434 8.91471 4.95147 8.975 5.5H4V6.5H8.975C8.91471 7.04853 8.65453 7.55566 8.24413 7.92456C7.83372 8.29347 7.30183 8.49831 6.75 8.5H4V9.6726L8.80845 14L9.4774 13.2569L5.303 9.5H6.75C7.56801 9.49875 8.3555 9.18927 8.95549 8.63326C9.55548 8.07725 9.9239 7.31555 9.9873 6.5H12V5.5H9.9873C9.92999 4.74924 9.61267 4.04197 9.09 3.5H12Z" fill="#262626"/>
                        </svg>
                        <span>₹{course.price}</span>
                      </div>

                      <div className="course-actions">
                        <button className="enrolled-status-button" disabled>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#28a745"/>
                          </svg>
                          Enrolled
                        </button>
                        <button
                          className="view-details-button"
                          onClick={() => handleViewDetails(course)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M15.4698 7.83C14.8817 6.30882 13.8608 4.99331 12.5332 4.04604C11.2056 3.09878 9.62953 2.56129 7.99979 2.5C6.37005 2.56129 4.79398 3.09878 3.46639 4.04604C2.1388 4.99331 1.11787 6.30882 0.529787 7.83C0.490071 7.93985 0.490071 8.06015 0.529787 8.17C1.11787 9.69118 2.1388 11.0067 3.46639 11.954C4.79398 12.9012 6.37005 13.4387 7.99979 13.5C9.62953 13.4387 11.2056 12.9012 12.5332 11.954C13.8608 11.0067 14.8817 9.69118 15.4698 8.17C15.5095 8.06015 15.5095 7.93985 15.4698 7.83ZM7.99979 12.5C5.34979 12.5 2.54979 10.535 1.53479 8C2.54979 5.465 5.34979 3.5 7.99979 3.5C10.6498 3.5 13.4498 5.465 14.4648 8C13.4498 10.535 10.6498 12.5 7.99979 12.5Z" fill="white"/>
                            <path d="M7.99979 5C7.40644 5 6.82642 5.17595 6.33308 5.50559C5.83973 5.83524 5.45521 6.30377 5.22815 6.85195C5.00109 7.40013 4.94168 8.00333 5.05743 8.58527C5.17319 9.16721 5.45891 9.70176 5.87847 10.1213C6.29802 10.5409 6.83257 10.8266 7.41452 10.9424C7.99646 11.0581 8.59966 10.9987 9.14784 10.7716C9.69602 10.5446 10.1646 10.1601 10.4942 9.66671C10.8238 9.17336 10.9998 8.59334 10.9998 8C10.9998 7.20435 10.6837 6.44129 10.1211 5.87868C9.5585 5.31607 8.79544 5 7.99979 5ZM7.99979 10C7.60422 10 7.21755 9.8827 6.88865 9.66294C6.55975 9.44318 6.3034 9.13082 6.15203 8.76537C6.00065 8.39991 5.96105 7.99778 6.03822 7.60982C6.11539 7.22186 6.30587 6.86549 6.58557 6.58579C6.86528 6.30608 7.22164 6.1156 7.60961 6.03843C7.99757 5.96126 8.3997 6.00087 8.76515 6.15224C9.13061 6.30362 9.44296 6.55996 9.66273 6.88886C9.88249 7.21776 9.99979 7.60444 9.99979 8C9.99979 8.53043 9.78907 9.03914 9.414 9.41421C9.03893 9.78929 8.53022 10 7.99979 10Z" fill="white"/>
                          </svg>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Courses Section */}
          <div className="available-courses-section">
            <div className="courses-header">
              <h3 className="subsection-title">Available Courses</h3>

              {/* Search Section */}
              <div className="search-container">
                <div className="search-input-wrapper">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#525252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search courses by title, instructor, or category..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-button"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="#8D8D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <div className="search-results-info">
                    {filteredCourses.length === 0 ? (
                      <p className="no-results">No courses found for "{searchQuery}"</p>
                    ) : (
                      <p className="results-count">
                        {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="courses-grid">
              {filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <svg className="course-icon" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M36 45H12C11.2046 44.9991 10.4421 44.6827 9.87969 44.1203C9.31728 43.5579 9.00091 42.7954 9 42V6C9.00079 5.20459 9.31712 4.44199 9.87956 3.87956C10.442 3.31712 11.2046 3.00079 12 3H36C36.7954 3.00091 37.5579 3.31728 38.1203 3.87969C38.6827 4.4421 38.9991 5.20463 39 6V30.9273L31.5 27.1773L24 30.9273V6H12V42H36V36H39V42C38.9989 42.7953 38.6825 43.5578 38.1201 44.1201C37.5578 44.6825 36.7953 44.9989 36 45ZM31.5 23.8227L36 26.0727V6H27V26.0727L31.5 23.8227Z" fill="#F4F4F4"/>
                  </svg>
                </div>
                
                <div className="course-content">
                  <h4 className="course-title">{course.title}</h4>
                  
                  <div className="course-instructor">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2C8.49445 2 8.9778 2.14662 9.38893 2.42133C9.80005 2.69603 10.1205 3.08648 10.3097 3.54329C10.4989 4.00011 10.5484 4.50277 10.452 4.98773C10.3555 5.47268 10.1174 5.91814 9.76777 6.26777C9.41814 6.6174 8.97268 6.8555 8.48773 6.95196C8.00277 7.04843 7.50011 6.99892 7.04329 6.8097C6.58648 6.62048 6.19603 6.30005 5.92133 5.88893C5.64662 5.4778 5.5 4.99445 5.5 4.5C5.5 3.83696 5.76339 3.20107 6.23223 2.73223C6.70107 2.26339 7.33696 2 8 2ZM8 1C7.30777 1 6.63108 1.20527 6.0555 1.58986C5.47993 1.97444 5.03133 2.52107 4.76642 3.16061C4.50152 3.80015 4.4322 4.50388 4.56725 5.18282C4.7023 5.86175 5.03564 6.48539 5.52513 6.97487C6.01461 7.46436 6.63825 7.7977 7.31718 7.93275C7.99612 8.0678 8.69985 7.99849 9.33939 7.73358C9.97893 7.46867 10.5256 7.02007 10.9101 6.4445C11.2947 5.86892 11.5 5.19223 11.5 4.5C11.5 3.57174 11.1313 2.6815 10.4749 2.02513C9.8185 1.36875 8.92826 1 8 1Z" fill="#8D8D8D"/>
                      <path d="M13 15H12V12.5C12 12.1717 11.9353 11.8466 11.8097 11.5433C11.6841 11.24 11.4999 10.9644 11.2678 10.7322C11.0356 10.5001 10.76 10.3159 10.4567 10.1903C10.1534 10.0647 9.8283 10 9.5 10H6.5C5.83696 10 5.20107 10.2634 4.73223 10.7322C4.26339 11.2011 4 11.837 4 12.5V15H3V12.5C3 11.5717 3.36875 10.6815 4.02513 10.0251C4.6815 9.36875 5.57174 9 6.5 9H9.5C10.4283 9 11.3185 9.36875 11.9749 10.0251C12.6313 10.6815 13 11.5717 13 12.5V15Z" fill="#8D8D8D"/>
                    </svg>
                    <span>{course.instructor}</span>
                  </div>
                  
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-price">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 3.5V2.5H4V3.5H6.75C7.30183 3.50169 7.83372 3.70653 8.24413 4.07544C8.65453 4.44434 8.91471 4.95147 8.975 5.5H4V6.5H8.975C8.91471 7.04853 8.65453 7.55566 8.24413 7.92456C7.83372 8.29347 7.30183 8.49831 6.75 8.5H4V9.6726L8.80845 14L9.4774 13.2569L5.303 9.5H6.75C7.56801 9.49875 8.3555 9.18927 8.95549 8.63326C9.55548 8.07725 9.9239 7.31555 9.9873 6.5H12V5.5H9.9873C9.92999 4.74924 9.61267 4.04197 9.09 3.5H12Z" fill="#262626"/>
                    </svg>
                    <span>₹{course.price}</span>
                  </div>
                  
                  <div className="course-actions">
                    <button
                      className={`enroll-button ${isEnrolled(course.id) ? 'enrolled' : ''}`}
                      onClick={() => handleEnroll(course)}
                      disabled={isEnrolled(course.id)}
                    >
                      {isEnrolled(course.id) ? 'Enrolled' : 'Enroll Now'}
                    </button>
                    <button 
                      className="view-details-button"
                      onClick={() => handleViewDetails(course)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M15.4698 7.83C14.8817 6.30882 13.8608 4.99331 12.5332 4.04604C11.2056 3.09878 9.62953 2.56129 7.99979 2.5C6.37005 2.56129 4.79398 3.09878 3.46639 4.04604C2.1388 4.99331 1.11787 6.30882 0.529787 7.83C0.490071 7.93985 0.490071 8.06015 0.529787 8.17C1.11787 9.69118 2.1388 11.0067 3.46639 11.954C4.79398 12.9012 6.37005 13.4387 7.99979 13.5C9.62953 13.4387 11.2056 12.9012 12.5332 11.954C13.8608 11.0067 14.8817 9.69118 15.4698 8.17C15.5095 8.06015 15.5095 7.93985 15.4698 7.83ZM7.99979 12.5C5.34979 12.5 2.54979 10.535 1.53479 8C2.54979 5.465 5.34979 3.5 7.99979 3.5C10.6498 3.5 13.4498 5.465 14.4648 8C13.4498 10.535 10.6498 12.5 7.99979 12.5Z" fill="white"/>
                        <path d="M7.99979 5C7.40644 5 6.82642 5.17595 6.33308 5.50559C5.83973 5.83524 5.45521 6.30377 5.22815 6.85195C5.00109 7.40013 4.94168 8.00333 5.05743 8.58527C5.17319 9.16721 5.45891 9.70176 5.87847 10.1213C6.29802 10.5409 6.83257 10.8266 7.41452 10.9424C7.99646 11.0581 8.59966 10.9987 9.14784 10.7716C9.69602 10.5446 10.1646 10.1601 10.4942 9.66671C10.8238 9.17336 10.9998 8.59334 10.9998 8C10.9998 7.20435 10.6837 6.44129 10.1211 5.87868C9.5585 5.31607 8.79544 5 7.99979 5ZM7.99979 10C7.60422 10 7.21755 9.8827 6.88865 9.66294C6.55975 9.44318 6.3034 9.13082 6.15203 8.76537C6.00065 8.39991 5.96105 7.99778 6.03822 7.60982C6.11539 7.22186 6.30587 6.86549 6.58557 6.58579C6.86528 6.30608 7.22164 6.1156 7.60961 6.03843C7.99757 5.96126 8.3997 6.00087 8.76515 6.15224C9.13061 6.30362 9.44296 6.55996 9.66273 6.88886C9.88249 7.21776 9.99979 7.60444 9.99979 8C9.99979 8.53043 9.78907 9.03914 9.414 9.41421C9.03893 9.78929 8.53022 10 7.99979 10Z" fill="white"/>
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

            {filteredCourses.length === 0 && searchQuery && (
              <div className="no-courses-message">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#F4F4F4"/>
                  <path d="M44 24L24 44M24 24L44 44" stroke="#8D8D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No courses found</h3>
                <p>Try adjusting your search terms or browse all available courses.</p>
                <button className="clear-search-btn" onClick={clearSearch}>
                  Show All Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
