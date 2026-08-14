import { useNavigate } from "react-router-dom";
import { learnCategories } from "../data/learnVideos";
import Header from "../components/Header";

export default function Learn() {
  const navigate = useNavigate();

  return (
    <>
    <Header userType="orphanage" />
    
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Learn & Grow 📚
        </h1>

        {learnCategories.map((cat) => (
          <div key={cat.category} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {cat.category}
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {cat.videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() =>
                    navigate(`/learn/watch/${video.id}`, {
                      state: { category: cat.category },
                    })
                  }
                  className="min-w-[260px] cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {video.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
