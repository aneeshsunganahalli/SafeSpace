import Image from "next/image";
import Link from "next/link";
import JournalPreview from "../components/Journal/JournalPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-10">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Mental Health Journal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            A safe space to reflect on your emotions, track your mental wellbeing, and receive supportive insights.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              href="/auth/register"
              className="rounded-full px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full px-6 py-3 border border-black text-black font-medium hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Journal Component Preview - Now using the dedicated component */}
        <JournalPreview />
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Daily Journaling</h3>
            <p className="text-gray-600">
              Express your thoughts and feelings in a private, secure space designed for personal reflection.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Receive supportive feedback and personalized coping strategies based on your journal entries.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Mood Tracking</h3>
            <p className="text-gray-600">
              Visualize your emotional patterns over time and identify factors that impact your mental wellbeing.
            </p>
          </div>
        </div>
      </section>
      
      {/* How It Benefits You Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">SafeSpace's Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="min-w-[24px] mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900">Self-Awareness</h3>
              <p className="text-gray-600">Regular journaling helps identify emotional triggers and patterns in your thinking.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="min-w-[24px] mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900">Stress Reduction</h3>
              <p className="text-gray-600">Express and release emotions in a healthy way to reduce stress and anxiety.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="min-w-[24px] mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900">Personal Growth</h3>
              <p className="text-gray-600">Track your progress over time and celebrate your mental health journey.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="min-w-[24px] mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900">Actionable Strategies</h3>
              <p className="text-gray-600">Get personalized coping techniques based on your specific emotional needs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Start Your Mental Health Journey Today</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of users who are taking control of their mental wellbeing through reflective journaling.
        </p>
        <Link
          href="/auth/register"
          className="rounded-full px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Create Your Journal
        </Link>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Your privacy is our priority. All journal entries are encrypted and private.</p>
          <p className="mt-2">This app is not a replacement for professional mental health services.</p>
        </div>
      </section>
    </div>
  );
}
