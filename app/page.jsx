import Image from 'next/image';
import Header from '../components/Header';
import Button from '../components/Button';
import { BookIcon, BadgeIcon, UsersIcon } from '../components/Icons';

export default function Home() {
  return (
    <div className="landing-container">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Your Learning with Quick Course
            </h1>
            <p className="hero-subtitle">
              A comprehensive learning management system designed for students, instructors, and administrators. Create, learn, and grow with our innovative platform.
            </p>
            <div className="hero-buttons">
              <Button variant="primary">
                GET Started Free
              </Button>
              <Button variant="tertiary">
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/icons/landing 1.png"
              alt="Learning platform illustration"
              width={530}
              height={510}
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <div className="features-header">
            <h2 className="section-title">
              Why Choose Quick Course?
            </h2>
            <p className="section-subtitle">
              Our platform offers everything you need for effective learning and teaching
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <BookIcon className="feature-icon" />
              <h3 className="feature-title">
                Comprehensive Course<br />Management
              </h3>
              <p className="feature-description">
                Create and manage courses with multimedia lessons, assignments, quizzes, and progress tracking.
              </p>
            </div>
            
            <div className="feature-item">
              <UsersIcon className="feature-icon" />
              <h3 className="feature-title">
                Multi-Role Support
              </h3>
              <p className="feature-description">
                Dedicated dashboards for students, instructors, and admins with secure, role-based access.
              </p>
            </div>
            
            <div className="feature-item">
              <BadgeIcon className="feature-icon" />
              <h3 className="feature-title">
                Advanced Analytics
              </h3>
              <p className="feature-description">
                Track progress, analyze performance, and export detailed reports for actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to start learning?
          </h2>
          <p className="cta-subtitle">
            Join thousands of students and instructors already using Rezoomex School.
          </p>
          <Button variant="white">
            GET Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          © 2024 Quick Course - All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
