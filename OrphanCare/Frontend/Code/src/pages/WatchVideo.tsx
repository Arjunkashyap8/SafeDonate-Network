import { useParams, useLocation, useNavigate } from "react-router-dom";
import { learnCategories } from "../data/learnVideos";
import Header from "../components/Header";

export default function WatchVideo() {
  const { videoId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const category = learnCategories.find(
    (c) => c.category === state?.category
  );

  return (
    <>
<Header userType="orphanage" />


    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Video Player */}
        <div className="w-full aspect-video mb-8 rounded-xl overflow-hidden shadow-md bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allowFullScreen
          />
        </div>

        {/* Related Videos */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Related Videos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {category?.videos
            .filter((v) => v.id !== videoId)
            .map((video) => (
              <div
                key={video.id}
                onClick={() =>
                  navigate(`/learn/watch/${video.id}`, {
                    state: { category: category.category },
                  })
                }
                className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
              >
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-36 object-cover"
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
    </div>
    </>
  );
}
