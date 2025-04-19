import Link from "next/link";
import Image from "next/image";

const JournalPreview: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* App Interface Preview */}
      <div className="relative bg-white rounded-2xl shadow-xl p-4 md:p-6 overflow-hidden border border-gray-100">
        {/* Header Bar - Similar to our Navbar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-32 h-8  rounded flex items-center justify-center">
              <Image
                src="/SafeSpaceLogo3.png"
                alt="SafeSpace Logo"
                width={140}
                height={35}
                className="h-auto w-auto"
                priority
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">Journal</span>
            </div>
            <div className="w-24 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">Profile</span>
            </div>
          </div>
        </div>

        {/* Two-column layout for journal and insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Journal Entry Form Preview - Left Column */}
          <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Today's Journal</h3>

            {/* Mood Selection Preview */}
            <div className="mb-5">
              <div className="text-sm font-medium mb-2">How are you feeling today?</div>
              <div className="flex flex-wrap gap-2">
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-gray-300 shadow-sm">😢 Very Negative</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-gray-300 shadow-sm">😕 Negative</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-black text-white shadow-sm">😐 Neutral</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-gray-300 shadow-sm">🙂 Positive</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-gray-300 shadow-sm">😄 Very Positive</div>
              </div>
            </div>

            {/* Text Area Preview */}
            <div className="mb-5">
              <div className="h-32 bg-white border border-gray-300 rounded-md p-3 text-sm text-gray-600 shadow-sm">
                <p>Today I felt a mix of emotions. In the morning I was feeling a bit anxious about my upcoming presentation, but after lunch I started to feel more confident.</p>
                <p className="mt-2">I practiced my breathing exercises which helped calm my nerves...</p>
              </div>
            </div>

            {/* Tags Preview */}
            <div className="mb-5">
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="bg-white border border-gray-300 text-xs px-2.5 py-1 rounded-full flex items-center shadow-sm">
                  <span>anxiety</span>
                  <span className="ml-1.5 text-gray-500">×</span>
                </div>
                <div className="bg-white border border-gray-300 text-xs px-2.5 py-1 rounded-full flex items-center shadow-sm">
                  <span>work</span>
                  <span className="ml-1.5 text-gray-500">×</span>
                </div>
                <div className="bg-white border border-gray-300 text-xs px-2.5 py-1 rounded-full flex items-center shadow-sm">
                  <span>self-care</span>
                  <span className="ml-1.5 text-gray-500">×</span>
                </div>
              </div>
            </div>

            {/* Button Preview */}
            <div className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-black shadow-sm cursor-pointer hover:bg-black/90 transition-colors">
              Save Entry
            </div>
          </div>

          {/* Charts and Insights Preview - Right Column */}
          <div className="lg:col-span-3 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Your Mood Insights</h3>

            {/* Mood Trend Chart Preview */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
              <div className="text-sm font-medium mb-2">Weekly Mood Trend</div>
              <div className="h-36 bg-white rounded flex items-center justify-center">
                <div className="w-full px-4">
                  <div className="relative h-24">
                    {/* Simple chart visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between">
                      <div className="w-1/7 px-1">
                        <div className="bg-black h-12 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-black rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-black h-8 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-black rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-black h-16 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-black rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-black h-10 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-black rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-black h-14 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-black rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-black h-18 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-black rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-black h-20 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-black rounded-full mx-auto -mt-1.5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 border-t border-gray-100 pt-2">
                    <div className="text-xs text-gray-600 font-medium">Mon</div>
                    <div className="text-xs text-gray-600 font-medium">Tue</div>
                    <div className="text-xs text-gray-600 font-medium">Wed</div>
                    <div className="text-xs text-gray-600 font-medium">Thu</div>
                    <div className="text-xs text-gray-600 font-medium">Fri</div>
                    <div className="text-xs text-gray-600 font-medium">Sat</div>
                    <div className="text-xs text-gray-600 font-medium">Sun</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Distribution Chart Preview */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm font-medium mb-2">Mood Distribution</div>
              <div className="h-28 bg-white rounded flex items-center justify-center">
                <div className="w-full px-4">
                  <div className="flex items-end justify-between h-16">
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-red-500 bg-opacity-80 h-3 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-gray-600 font-medium mt-2">Very Negative</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-orange-500 bg-opacity-80 h-6 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-gray-600 font-medium mt-2">Negative</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-yellow-500 bg-opacity-80 h-12 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-gray-600 font-medium mt-2">Neutral</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-lime-500 bg-opacity-80 h-9 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-gray-600 font-medium mt-2">Positive</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-green-500 bg-opacity-80 h-5 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-gray-600 font-medium mt-2">Very Positive</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Preview Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-10">
          <p className="text-lg font-medium text-gray-900 mb-4">Experience the full functionality when you sign up</p>
          <Link
            href="/auth/register"
            className="rounded-full px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JournalPreview;