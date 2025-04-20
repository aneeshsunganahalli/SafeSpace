interface ContentProps {
  content: string;
}

export default function JournalContentCard({ content }: ContentProps) {
  return (
    <div className="card overflow-hidden mb-6">
      <div className="py-2 px-4 bg-[#3C3C3C] text-white font-medium flex items-center justify-center">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Journal Content
      </div>
      <div className="p-5 bg-white">
        <p className="text-[#3C3C3C] whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}