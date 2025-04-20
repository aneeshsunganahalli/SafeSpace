import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-16 md:pt-24 pb-12">
      {/* Hero Section */}
      <section className="px-6 max-w-6xl mx-auto mb-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About SafeSpace
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl">
            A digital sanctuary designed to nurture your mental wellbeing through
            reflective journaling, mood tracking, and personalized insights.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At SafeSpace, we believe that everyone deserves access to tools that support 
                their mental health journey. Our mission is to provide a secure, judgment-free 
                environment where individuals can express themselves, track their emotional 
                patterns, and gain actionable insights.
              </p>
              <p className="text-lg text-gray-600">
                Through technology and compassionate design, we aim to make mental health 
                self-care accessible, engaging, and effective for people from all walks of life.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Showcase */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Makes SafeSpace Special
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Journal Feature */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6 rounded-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Intuitive Journal</h3>
              <p className="text-gray-600 mb-4">
                Express your thoughts freely in our clean, distraction-free writing environment. 
                Add mood ratings and tags to track patterns in your emotional wellbeing over time.
              </p>
              <div className="flex items-center pt-2">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 mr-2"></div>
                <span className="text-sm font-medium text-gray-500">Daily entries build your streak</span>
              </div>
            </div>

            {/* Mood Tracking Feature */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6 rounded-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Mood Tracking</h3>
              <p className="text-gray-600 mb-4">
                Visualize your emotional patterns with our interactive charts. Identify trends, 
                triggers, and improvements in your mental wellbeing at a glance.
              </p>
              <div className="flex items-center pt-2">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 mr-2"></div>
                <span className="text-sm font-medium text-gray-500">Visual insights of your journey</span>
              </div>
            </div>

            {/* AI Analysis Feature */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6 rounded-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="p-6 bg-white rounded-xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI-Powered Insights</h3>
              <p className="text-gray-600 mb-4">
                Receive thoughtful analysis of your journal entries, with personalized suggestions 
                for coping strategies and mindfulness exercises tailored to your needs.
              </p>
              <div className="flex items-center pt-2">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 mr-2"></div>
                <span className="text-sm font-medium text-gray-500">Personalized for you</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streak and Gamification */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Building Healthy Habits</h2>
              <p className="text-lg text-gray-600 mb-6">
                We've integrated subtle gamification elements to help you build a consistent 
                journaling practice. Your streak counter shows how many consecutive days you've 
                journaled, encouraging regular reflection.
              </p>
              <p className="text-lg text-gray-600">
                Milestone achievements celebrate your dedication to self-care, while our word cloud 
                visualizations help you identify recurring themes in your journal entries.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-lg p-6 bg-white">
                <div className="flex items-center justify-center mb-8">
                  <div className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-5 py-2.5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11.1c.5 2 .5 3.5-1.185 5.4" />
                    </svg>
                    <span className="text-sm font-bold text-white">14 day streak</span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-400 h-2.5 rounded-full" style={{ width: '47%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>Progress: 14/30 days</span>
                  <span>47%</span>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Achievement Unlocked!</h4>
                  <p className="text-sm text-gray-600">Two weeks of consistent journaling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Word Cloud Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visualize Your Thoughts</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our word cloud feature helps you visualize the themes and topics that appear most 
                frequently in your journal. This can provide valuable insights into what's occupying 
                your mind and what matters most to you.
              </p>
              <p className="text-lg text-gray-600">
                Over time, you might notice shifts in these patterns as your focus and emotional 
                state evolve—another powerful way to track your personal growth.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md aspect-square bg-white rounded-xl p-8 shadow-lg">
                <div className="w-full h-full rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden">
                  {/* Simulated word cloud */}
                  <span className="absolute text-3xl font-bold text-gray-800" style={{ top: '40%', left: '35%' }}>happiness</span>
                  <span className="absolute text-2xl font-medium text-gray-700" style={{ top: '25%', left: '30%' }}>gratitude</span>
                  <span className="absolute text-xl font-medium text-gray-600" style={{ top: '55%', left: '25%' }}>mindful</span>
                  <span className="absolute text-lg font-medium text-gray-500" style={{ top: '35%', left: '65%' }}>progress</span>
                  <span className="absolute text-base font-medium text-gray-500" style={{ top: '60%', left: '60%' }}>family</span>
                  <span className="absolute text-base font-medium text-gray-400" style={{ top: '20%', left: '55%' }}>growth</span>
                  <span className="absolute text-sm font-medium text-gray-400" style={{ top: '70%', left: '40%' }}>peaceful</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Security */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Privacy Matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-black/90 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure and Private</h3>
              <p className="text-gray-600">
                Your journal entries are encrypted and accessible only to you. We implement 
                industry-standard security practices to ensure that your personal thoughts 
                remain confidential and protected.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-black/90 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Data Transparency</h3>
              <p className="text-gray-600">
                We're committed to transparency about how your data is used. Your information 
                is never sold to third parties, and you maintain complete control over your content. 
                You can export or delete your data at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            SafeSpace was created by a dedicated team passionate about mental health, technology, and user experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4">
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
              <p className="text-sm text-gray-500 mb-3">Founder & CEO</p>
              <p className="text-sm text-gray-600">
                Mental health advocate with a background in psychology and technology.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4">
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Michael Chen</h3>
              <p className="text-sm text-gray-500 mb-3">Lead Developer</p>
              <p className="text-sm text-gray-600">
                Full-stack engineer with a passion for creating tools that make a difference.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4">
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Emily Rodriguez</h3>
              <p className="text-sm text-gray-500 mb-3">UX Designer</p>
              <p className="text-sm text-gray-600">
                User experience specialist focused on creating calming digital environments.
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4">
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">David Kim</h3>
              <p className="text-sm text-gray-500 mb-3">Clinical Advisor</p>
              <p className="text-sm text-gray-600">
                Licensed therapist ensuring our approach aligns with best mental health practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Begin Your Journey Today</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their mental wellbeing through 
            reflective journaling with SafeSpace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="rounded-full px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium hover:from-orange-600 hover:to-yellow-500 transition-colors shadow-lg"
            >
              Start Your Journal
            </Link>
            <Link
              href="/journal"
              className="rounded-full px-8 py-3 bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}