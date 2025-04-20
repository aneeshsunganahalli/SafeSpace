interface TagsProps {
  tags: string[];
}

export default function JournalTagsCard({ tags }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="card mb-6 overflow-hidden">
      <div className="py-2 px-4 bg-[#3C3C3C] text-white font-medium flex items-center justify-center">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
        Tags
      </div>
      <div className="p-5 bg-white">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-[#F2F4F8] border border-[#CFE3DC] rounded-full px-3 py-1.5 text-sm font-medium text-[#3C3C3C] hover:bg-[#CFE3DC]/40 transition-colors cursor-default"
            >
              <svg className="w-3.5 h-3.5 mr-1.5 text-[#3C3C3C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
              </svg>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}