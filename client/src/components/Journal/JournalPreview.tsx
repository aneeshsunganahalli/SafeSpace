import Link from "next/link";
import Image from "next/image";

const JournalPreview: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* App Interface Preview */}
      <div className="relative bg-white rounded-2xl shadow-xl p-4 md:p-6 overflow-hidden border border-[#C1DFF0]">
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
            <div className="w-20 h-8 bg-[#F2F4F8] rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-[#3C3C3C]">Journal</span>
            </div>
            <div className="w-24 h-8 bg-[#3C3C3C] rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">Profile</span>
            </div>
          </div>
        </div>

        {/* Two-column layout for journal and insights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Journal Entry Form Preview - Left Column */}
          <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-sm border border-[#CFE3DC]">
            <h3 className="text-lg font-semibold mb-4 text-[#3C3C3C]">Today's Journal</h3>

            {/* Mood Selection Preview */}
            <div className="mb-5">
              <div className="text-sm font-medium mb-2 text-[#3C3C3C]">How are you feeling today?</div>
              <div className="flex flex-wrap gap-2">
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-[#FBE4E7] shadow-sm">😢 Very Negative</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-[#FBE4E7] shadow-sm">😕 Negative</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-[#3C3C3C] text-white shadow-sm">😐 Neutral</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-[#C1DFF0] shadow-sm">🙂 Positive</div>
                <div className="py-2 px-4 rounded-full text-xs font-medium bg-white border border-[#C1DFF0] shadow-sm">😄 Very Positive</div>
              </div>
            </div>

            {/* Text Area Preview */}
            <div className="mb-5">
              <div className="h-32 bg-[#F2F4F8] border border-[#CFE3DC] rounded-md p-3 text-sm text-[#3C3C3C] shadow-sm">
                <p>Today I felt a mix of emotions. In the morning I was feeling a bit anxious about my upcoming presentation, but after lunch I started to feel more confident.</p>
                <p className="mt-2">I practiced my breathing exercises which helped calm my nerves...</p>
              </div>
            </div>

            {/* Tags Preview */}
            <div className="mb-5">
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="bg-[#F2F4F8] border border-[#CFE3DC] text-xs px-2.5 py-1 rounded-full flex items-center shadow-sm">
                  <span className="text-[#3C3C3C]">anxiety</span>
                  <span className="ml-1.5 text-gray-500">×</span>
                </div>
                <div className="bg-[#F2F4F8] border border-[#CFE3DC] text-xs px-2.5 py-1 rounded-full flex items-center shadow-sm">
                  <span className="text-[#3C3C3C]">work</span>
                  <span className="ml-1.5 text-gray-500">×</span>
                </div>
                <div className="bg-[#F2F4F8] border border-[#CFE3DC] text-xs px-2.5 py-1 rounded-full flex items-center shadow-sm">
                  <span className="text-[#3C3C3C]">self-care</span>
                  <span className="ml-1.5 text-gray-500">×</span>
                </div>
              </div>
            </div>

            {/* Button Preview */}
            <div className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-[#3C3C3C] shadow-sm cursor-pointer hover:bg-black/90 transition-colors">
              Save Entry
            </div>
          </div>

          {/* Charts and Insights Preview - Right Column */}
          <div className="lg:col-span-3 bg-white p-5 rounded-lg shadow-sm border border-[#C1DFF0]">
            <h3 className="text-lg font-semibold mb-4 text-[#3C3C3C]">Your Mood Insights</h3>

            {/* Mood Trend Chart Preview */}
            <div className="bg-[#F2F4F8] p-4 rounded-lg border border-[#C1DFF0] shadow-sm mb-6">
              <div className="text-sm font-medium mb-2 text-[#3C3C3C]">Weekly Mood Trend</div>
              <div className="h-36 bg-white rounded flex items-center justify-center">
                <div className="w-full px-4">
                  <div className="relative h-24">
                    {/* Simple chart visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between">
                      <div className="w-1/7 px-1">
                        <div className="bg-[#C1DFF0] h-12 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-[#3C3C3C] rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-[#C1DFF0] h-8 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-[#3C3C3C] rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-[#C1DFF0] h-16 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-[#3C3C3C] rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-[#C1DFF0] h-10 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-[#3C3C3C] rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-[#C1DFF0] h-14 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-[#3C3C3C] rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-[#C1DFF0] h-18 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-[#3C3C3C] rounded-full mx-auto -mt-1.5"></div>
                      </div>
                      <div className="w-1/7 px-1">
                        <div className="bg-[#C1DFF0] h-20 w-full rounded-t"></div>
                        <div className="h-1.5 w-1.5 bg-[#3C3C3C] rounded-full mx-auto -mt-1.5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 border-t border-[#CFE3DC] pt-2">
                    <div className="text-xs text-[#3C3C3C] font-medium">Mon</div>
                    <div className="text-xs text-[#3C3C3C] font-medium">Tue</div>
                    <div className="text-xs text-[#3C3C3C] font-medium">Wed</div>
                    <div className="text-xs text-[#3C3C3C] font-medium">Thu</div>
                    <div className="text-xs text-[#3C3C3C] font-medium">Fri</div>
                    <div className="text-xs text-[#3C3C3C] font-medium">Sat</div>
                    <div className="text-xs text-[#3C3C3C] font-medium">Sun</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Distribution Chart Preview */}
            <div className="bg-[#F2F4F8] p-4 rounded-lg border border-[#C1DFF0] shadow-sm">
              <div className="text-sm font-medium mb-2 text-[#3C3C3C]">Mood Distribution</div>
              <div className="h-28 bg-white rounded flex items-center justify-center">
                <div className="w-full px-4">
                  <div className="flex items-end justify-between h-16">
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-[#FBE4E7] h-3 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-[#3C3C3C] font-medium mt-2">Very Negative</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-[#FBE4E7] bg-opacity-70 h-6 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-[#3C3C3C] font-medium mt-2">Negative</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-[#CFE3DC] h-12 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-[#3C3C3C] font-medium mt-2">Neutral</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-[#C1DFF0] bg-opacity-80 h-9 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-[#3C3C3C] font-medium mt-2">Positive</div>
                    </div>
                    <div className="w-1/5 px-1 flex flex-col items-center">
                      <div className="bg-[#C1DFF0] h-5 w-full rounded-t shadow-inner"></div>
                      <div className="text-xs text-[#3C3C3C] font-medium mt-2">Very Positive</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Preview Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-10">
          <p className="text-lg font-medium text-[#3C3C3C] mb-4">Experience the full functionality when you sign up</p>
          <Link
            href="/auth/register"
            className="rounded-full px-6 py-3 bg-[#3C3C3C] text-white font-medium hover:bg-[#3C3C3C]/90 transition-colors shadow-md"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JournalPreview;