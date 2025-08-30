'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function CourseDetails() {
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Get course data from URL params or localStorage
      const courseId = searchParams.get('id');
      const courseData = localStorage.getItem(`courseDetails_${courseId}`);

      if (courseData) {
        const parsedCourse = JSON.parse(courseData);
        setCourse(parsedCourse);

        // Check if user is enrolled in this course
        const userEmail = parsedUser.email;
        const enrolledData = localStorage.getItem(`enrolledCourses_${userEmail}`);
        if (enrolledData) {
          const enrolledCourses = JSON.parse(enrolledData);
          const enrolled = enrolledCourses.some(c => c.id === parsedCourse.id);
          setIsEnrolled(enrolled);
        }
      } else {
        // If no course data in localStorage, try to fetch from API or redirect back
        console.error('No course data found for ID:', courseId);
        alert('Course data not found. Redirecting back to dashboard.');

        // Redirect to appropriate dashboard based on user role
        switch (parsedUser.role) {
          case 'Student':
            router.push('/student-dashboard');
            break;
          case 'Author':
            router.push('/author-dashboard');
            break;
          case 'Admin':
            router.push('/admin-dashboard');
            break;
          default:
            router.push('/student-dashboard');
        }
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading course details:', error);
      router.push('/student-dashboard');
    }
  }, [router, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleBackToDashboard = () => {
    if (!user) return;

    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case 'Student':
        router.push('/student-dashboard');
        break;
      case 'Author':
        router.push('/author-dashboard');
        break;
      case 'Admin':
        router.push('/admin-dashboard');
        break;
      default:
        router.push('/student-dashboard'); // Default fallback
    }
  };

  const handleEnrollNow = async () => {
    if (!course || isEnrolled) return;

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
        setIsEnrolled(true);
        
        // Update enrolled courses in localStorage
        const userEmail = user.email;
        const enrolledData = localStorage.getItem(`enrolledCourses_${userEmail}`);
        const enrolledCourses = enrolledData ? JSON.parse(enrolledData) : [];
        enrolledCourses.push(course);
        localStorage.setItem(`enrolledCourses_${userEmail}`, JSON.stringify(enrolledCourses));
        
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


  const handleDownload = (material) => {
    // Simulate file download
    alert(`Downloading ${material.fileName}`);
  };

  if (loading || !course) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="course-details-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <Image
            src="/icons/rezoomex_logo_1000w 1.png"
            alt="Rezoomex Logo"
            width={116}
            height={44}
          />
        </div>
        <div className="header-user-info">
          <div className="user-profile">
            <svg className="user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C12.7417 3 13.4667 3.21993 14.0834 3.63199C14.7001 4.04404 15.1807 4.62971 15.4645 5.31494C15.7484 6.00016 15.8226 6.75416 15.6779 7.48159C15.5333 8.20902 15.1761 8.8772 14.6517 9.40165C14.1272 9.9261 13.459 10.2833 12.7316 10.4279C12.0042 10.5726 11.2502 10.4984 10.5649 10.2145C9.87971 9.93072 9.29404 9.45007 8.88199 8.83339C8.46993 8.2167 8.25 7.49168 8.25 6.75C8.25 5.75544 8.64509 4.80161 9.34835 4.09835C10.0516 3.39509 11.0054 3 12 3ZM12 1.5C10.9616 1.5 9.94661 1.80791 9.08326 2.38478C8.2199 2.96166 7.54699 3.7816 7.14963 4.74091C6.75227 5.70022 6.64831 6.75582 6.85088 7.77422C7.05345 8.79262 7.55346 9.72808 8.28769 10.4623C9.02192 11.1965 9.95738 11.6966 10.9758 11.8991C11.9942 12.1017 13.0498 11.9977 14.0091 11.6004C14.9684 11.203 15.7883 10.5301 16.3652 9.66674C16.9421 8.80339 17.25 7.78835 17.25 6.75C17.25 5.35761 16.6969 4.02226 15.7123 3.03769C14.7277 2.05312 13.3924 1.5 12 1.5Z" fill="#161616"/>
              <path d="M19.5 22.5H18V18.75C18 18.2575 17.903 17.7699 17.7145 17.3149C17.5261 16.86 17.2499 16.4466 16.9017 16.0983C16.5534 15.7501 16.14 15.4739 15.6851 15.2855C15.2301 15.097 14.7425 15 14.25 15H9.75C8.75544 15 7.80161 15.3951 7.09835 16.0983C6.39509 16.8016 6 17.7554 6 18.75V22.5H4.5V18.75C4.5 17.3576 5.05312 16.0223 6.03769 15.0377C7.02226 14.0531 8.35761 13.5 9.75 13.5H14.25C15.6424 13.5 16.9777 14.0531 17.9623 15.0377C18.9469 16.0223 19.5 17.3576 19.5 18.75V22.5Z" fill="#161616"/>
            </svg>
            <span className="user-name">{user?.fullName}</span>
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
      <main className="course-details-main">
        {/* Course Overview Section */}
        <div className="course-overview-card">
          <div className="course-title-section">
            <h1 className="course-title-main">{course.title}</h1>
            <div className="course-price-section">
              <svg className="rupee-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" fill="white" style={{mixBlendMode: 'multiply'}}/>
                <path d="M18 5.25V3.75H6V5.25H10.125C10.9528 5.25253 11.7506 5.5598 12.3662 6.11316C12.9818 6.66651 13.3721 7.4272 13.4625 8.25H6V9.75H13.4625C13.3721 10.5728 12.9818 11.3335 12.3662 11.8868C11.7506 12.4402 10.9528 12.7475 10.125 12.75H6V14.5089L13.2127 21L14.2161 19.8853L7.9545 14.25H10.125C11.352 14.2481 12.5333 13.7839 13.4332 12.9499C14.3332 12.1159 14.8859 10.9733 14.9809 9.75H18V8.25H14.9809C14.895 7.12387 14.419 6.06296 13.635 5.25H18Z" fill="#262626"/>
              </svg>
              <span className="price-amount">{course.price}</span>
            </div>
          </div>
          
          <div className="course-instructor-section">
            <svg className="instructor-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" fill="white" style={{mixBlendMode: 'multiply'}}/>
              <path d="M10 2.5C10.6181 2.5 11.2223 2.68328 11.7362 3.02666C12.2501 3.37004 12.6506 3.8581 12.8871 4.42911C13.1236 5.00013 13.1855 5.62847 13.065 6.23466C12.9444 6.84085 12.6467 7.39767 12.2097 7.83471C11.7727 8.27175 11.2158 8.56938 10.6097 8.68995C10.0035 8.81053 9.37513 8.74865 8.80411 8.51212C8.2331 8.2756 7.74504 7.87506 7.40166 7.36116C7.05828 6.84725 6.875 6.24307 6.875 5.625C6.875 4.7962 7.20424 4.00134 7.79029 3.41529C8.37634 2.82924 9.1712 2.5 10 2.5ZM10 1.25C9.13471 1.25 8.28885 1.50659 7.56938 1.98732C6.84992 2.46805 6.28916 3.15133 5.95803 3.95076C5.62689 4.75019 5.54025 5.62985 5.70906 6.47852C5.87787 7.32719 6.29455 8.10674 6.90641 8.71859C7.51826 9.33045 8.29781 9.74712 9.14648 9.91594C9.99515 10.0847 10.8748 9.99811 11.6742 9.66697C12.4737 9.33584 13.1569 8.77508 13.6377 8.05562C14.1184 7.33615 14.375 6.49029 14.375 5.625C14.375 4.46468 13.9141 3.35188 13.0936 2.53141C12.2731 1.71094 11.1603 1.25 10 1.25Z" fill="#8D8D8D"/>
              <path d="M16.25 18.75H15V15.625C15 15.2146 14.9192 14.8083 14.7621 14.4291C14.6051 14.05 14.3749 13.7055 14.0847 13.4153C13.7945 13.1251 13.45 12.8949 13.0709 12.7379C12.6917 12.5808 12.2854 12.5 11.875 12.5H8.125C7.2962 12.5 6.50134 12.8292 5.91529 13.4153C5.32924 14.0013 5 14.7962 5 15.625V18.75H3.75V15.625C3.75 14.4647 4.21094 13.3519 5.03141 12.5314C5.85188 11.7109 6.96468 11.25 8.125 11.25H11.875C13.0353 11.25 14.1481 11.7109 14.9686 12.5314C15.7891 13.3519 16.25 14.4647 16.25 15.625V18.75Z" fill="#8D8D8D"/>
            </svg>
            <span className="instructor-name">By {course.instructor}</span>
          </div>

          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">{course.description}</p>
          </div>
        </div>

        {/* Course Material Section */}
        <div className="course-material-card">
          <h3 className="material-title">Course Material</h3>
          <div className="material-items">
            {course.materials?.map((material, index) => (
              <div key={index} className="material-item" onClick={() => handleDownload(material)}>
                <svg className="download-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16" height="16" fill="white" style={{mixBlendMode: 'multiply'}}/>
                  <path d="M13 12V14H3V12H2V14C2 14.2652 2.10536 14.5196 2.29289 14.7071C2.48043 14.8946 2.73478 15 3 15H13C13.2652 15 13.5196 14.8946 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14V12H13Z" fill="#393939"/>
                  <path d="M13 7L12.295 6.295L8.5 10.085V1H7.5V10.085L3.705 6.295L3 7L8 12L13 7Z" fill="#393939"/>
                </svg>
                <div className="material-info">
                  <span className="material-filename">{material.fileName}</span>
                  <span className="material-details">({material.fileType} • {material.fileSize})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Information Sidebar */}
        <div className="course-info-card">
          <h3 className="info-title">Course Information</h3>
          
          <div className="info-item">
            <svg className="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" fill="white" style={{mixBlendMode: 'multiply'}}/>
              <path d="M16.25 2.5H13.75V1.25H12.5V2.5H7.5V1.25H6.25V2.5H3.75C3.0625 2.5 2.5 3.0625 2.5 3.75V16.25C2.5 16.9375 3.0625 17.5 3.75 17.5H16.25C16.9375 17.5 17.5 16.9375 17.5 16.25V3.75C17.5 3.0625 16.9375 2.5 16.25 2.5ZM16.25 16.25H3.75V7.5H16.25V16.25ZM16.25 6.25H3.75V3.75H6.25V5H7.5V3.75H12.5V5H13.75V3.75H16.25V6.25Z" fill="#8D8D8D"/>
            </svg>
            <span className="info-text">Created {course.createdDate}</span>
          </div>

          <div className="info-item">
            <svg className="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" fill="white" style={{mixBlendMode: 'multiply'}}/>
              <path d="M10 2.5C10.6181 2.5 11.2223 2.68328 11.7362 3.02666C12.2501 3.37004 12.6506 3.8581 12.8871 4.42911C13.1236 5.00013 13.1855 5.62847 13.065 6.23466C12.9444 6.84085 12.6467 7.39767 12.2097 7.83471C11.7727 8.27175 11.2158 8.56938 10.6097 8.68995C10.0035 8.81053 9.37513 8.74865 8.80411 8.51212C8.2331 8.2756 7.74504 7.87506 7.40166 7.36116C7.05828 6.84725 6.875 6.24307 6.875 5.625C6.875 4.7962 7.20424 4.00134 7.79029 3.41529C8.37634 2.82924 9.1712 2.5 10 2.5ZM10 1.25C9.13471 1.25 8.28885 1.50659 7.56938 1.98732C6.84992 2.46805 6.28916 3.15133 5.95803 3.95076C5.62689 4.75019 5.54025 5.62985 5.70906 6.47852C5.87787 7.32719 6.29455 8.10674 6.90641 8.71859C7.51826 9.33045 8.29781 9.74712 9.14648 9.91594C9.99515 10.0847 10.8748 9.99811 11.6742 9.66697C12.4737 9.33584 13.1569 8.77508 13.6377 8.05562C14.1184 7.33615 14.375 6.49029 14.375 5.625C14.375 4.46468 13.9141 3.35188 13.0936 2.53141C12.2731 1.71094 11.1603 1.25 10 1.25Z" fill="#8D8D8D"/>
              <path d="M16.25 18.75H15V15.625C15 15.2146 14.9192 14.8083 14.7621 14.4291C14.6051 14.05 14.3749 13.7055 14.0847 13.4153C13.7945 13.1251 13.45 12.8949 13.0709 12.7379C12.6917 12.5808 12.2854 12.5 11.875 12.5H8.125C7.2962 12.5 6.50134 12.8292 5.91529 13.4153C5.32924 14.0013 5 14.7962 5 15.625V18.75H3.75V15.625C3.75 14.4647 4.21094 13.3519 5.03141 12.5314C5.85188 11.7109 6.96468 11.25 8.125 11.25H11.875C13.0353 11.25 14.1481 11.7109 14.9686 12.5314C15.7891 13.3519 16.25 14.4647 16.25 15.625V18.75Z" fill="#8D8D8D"/>
            </svg>
            <span className="info-text">Instructor {course.instructor}</span>
          </div>

          <div className="info-item">
            <svg className="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" fill="white" style={{mixBlendMode: 'multiply'}}/>
              <path d="M15 4.375V3.125H5V4.375H8.4375C9.12729 4.37711 9.79215 4.63317 10.3052 5.0943C10.8182 5.55543 11.1434 6.18933 11.2188 6.875H5V8.125H11.2188C11.1434 8.81067 10.8182 9.44457 10.3052 9.9057C9.79215 10.3668 9.12729 10.6229 8.4375 10.625H5V12.0907L11.0106 17.5L11.8467 16.5711L6.62875 11.875H8.4375C9.46001 11.8734 10.4444 11.4866 11.1944 10.7916C11.9444 10.0966 12.4049 9.14444 12.4841 8.125H15V6.875H12.4841C12.4125 5.93655 12.0158 5.05247 11.3625 4.375H15Z" fill="#8D8D8D"/>
            </svg>
            <span className="info-text">UPI ID {course.upiId}</span>
          </div>

          <div className="action-buttons">
            <button 
              className={`enroll-now-button ${isEnrolled ? 'enrolled' : ''}`}
              onClick={handleEnrollNow}
              disabled={isEnrolled}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </button>
            
            <button className="back-dashboard-button" onClick={handleBackToDashboard}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{marginRight: '8px'}}>
                <path d="M6.5 3.5L2 8L6.5 12.5M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to {user?.role === 'Student' ? 'Student' : user?.role === 'Author' ? 'Author' : user?.role === 'Admin' ? 'Admin' : ''} Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
