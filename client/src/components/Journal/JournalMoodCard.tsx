interface MoodProps {
  mood: {
    label: string;
    score?: number;
  };
}

export default function JournalMoodCard({ mood }: MoodProps) {
  if (!mood || !mood.label) return null;

  const getMoodEmoji = (label: string) => {
    switch (label) {
      case "Very Positive": return "😄";
      case "Positive": return "🙂";
      case "Neutral": return "😐";
      case "Negative": return "🙁";
      case "Very Negative":
      default: return "😞";
    }
  };

  const getMoodBackgroundColor = (label: string) => {
    switch (label) {
      case "Very Positive":
        return "bg-gradient-to-r from-[#C1DFF0] to-[#C1DFF0]/80";
      case "Positive":
        return "bg-gradient-to-r from-[#C1DFF0]/80 to-[#C1DFF0]/60";
      case "Neutral":
        return "bg-gradient-to-r from-[#CFE3DC] to-[#CFE3DC]/80";
      case "Negative":
        return "bg-gradient-to-r from-[#FBE4E7]/80 to-[#FBE4E7]/60";
      case "Very Negative":
      default:
        return "bg-gradient-to-r from-[#FBE4E7] to-[#FBE4E7]/80";
    }
  };

  const getMoodIconBackground = (label: string) => {
    switch (label) {
      case "Very Positive":
        return "bg-gradient-to-br from-[#C1DFF0] to-[#C1DFF0]/70";
      case "Positive":
        return "bg-gradient-to-br from-[#C1DFF0]/80 to-[#C1DFF0]/50";
      case "Neutral":
        return "bg-gradient-to-br from-[#CFE3DC] to-[#CFE3DC]/70";
      case "Negative":
        return "bg-gradient-to-br from-[#FBE4E7]/80 to-[#FBE4E7]/50";
      case "Very Negative":
      default:
        return "bg-gradient-to-br from-[#FBE4E7] to-[#FBE4E7]/70";
    }
  };

  return (
    <div className="card mb-6 overflow-hidden">
      <div className={`py-2 px-4 font-medium text-center flex items-center justify-center ${getMoodBackgroundColor(mood.label)}`}>
        <svg className="w-5 h-5 mr-1.5 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="text-[#3C3C3C] font-medium">Your Mood</span>
      </div>
      <div className="p-5 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-md ${getMoodIconBackground(mood.label)}`}>
              <span className="text-3xl">
                {getMoodEmoji(mood.label)}
              </span>
            </div>
            <span className="text-2xl font-medium text-[#3C3C3C]">
              {mood.label}
            </span>
          </div>
          {mood.score && (
            <div className="text-sm text-white font-medium bg-[#3C3C3C] px-3 py-1.5 rounded-full shadow">
              Score: {mood.score}/10
            </div>
          )}
        </div>
      </div>
    </div>
  );
}