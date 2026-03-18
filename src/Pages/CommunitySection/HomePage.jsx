import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import CommunityHeader from "../../Components/CommunitySection/CommunityHeader";
import CommunityTabs from "../../Components/CommunitySection/CommunityTabs";
import PostComposer from "../../Components/CommunitySection/PostComposer";
import PostFeed from "../../Components/CommunitySection/PostFeed";
import ProfileSidebar from "../../Components/CommunitySection/ProfileSidebar";
import DocumentsPanel from "../../Components/CommunitySection/DocumentsPanel";
import ProjectsPanel from "../../Components/CommunitySection/ProjectsPanel";
import GalleryPanel from "../../Components/CommunitySection/GalleryPanel";

const tabs = ["Posts", "Documents", "Project", "Gallery"];

const posts = [
  {
    id: 1,
    author: "Test man",
    role: "Community admin",
    avatarLetter: "T",
    content:
      "Next Generation eXperience is a nonprofit organization committed to creating lasting impact through sustainable, community-driven development projects. We focus on areas like health, education, and the environment, empowering underserved populations through action, innovation, and collaboration.",
    createdAt: "Wednesday 3:27 AM",
    image: null,
  },
  {
    id: 2,
    author: "Test man",
    role: "Community admin",
    avatarLetter: "T",
    content:
      "Next Generation eXperience is a nonprofit organization committed to creating lasting impact through sustainable, community-driven development projects. We focus on areas like health, education, and the environment, empowering underserved populations through action, innovation, and collaboration.",
    createdAt: "Wednesday 3:27 AM",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80",
  },
];

const documents = [
  {
    id: 1,
    title: "Community Guidelines",
    description: "Rules and best practices for all Vimaux members.",
    type: "PDF",
  },
  {
    id: 2,
    title: "Impact Report",
    description: "A summary of NGX community outcomes and metrics.",
    type: "DOCX",
  },
];

const projects = [
  {
    id: 1,
    title: "Cape Town Hillside Outreach",
    date: "12/13/2025 - 12/14/2025",
    description:
      "A short outreach and engagement project focused on education, support, and visibility in the community.",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
  },
];

const gallery = [
  {
    id: 1,
    type: "image",
    title: "Team field visit",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    type: "video",
    title: "Community recap",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
  },
];

const notifications = [
  {
    id: 1,
    tone: "danger",
    message: "You don’t have access to view private documents.",
  },
  {
    id: 2,
    tone: "success",
    message: "You have been given access to view private documents.",
  },
];

const profile = {
  name: "Test man",
  email: "transact@gmail.com",
  password: "************",
  avatarLetter: "T",
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activePanel = useMemo(() => {
    switch (activeTab) {
      case "Documents":
        return <DocumentsPanel documents={documents} />;
      case "Project":
        return <ProjectsPanel projects={projects} />;
      case "Gallery":
        return <GalleryPanel items={gallery} />;
      case "Posts":
      default:
        return (
          <div className="space-y-7">
            <PostComposer />
            <PostFeed posts={posts} />
          </div>
        );
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#1f1f24]">
      <CommunityHeader title="Vimaux Community" />

      <main className="mx-auto max-w-[1480px] px-5 pb-10 pt-2 md:px-8 xl:px-10">
        <div className="mb-4 flex items-center justify-between xl:hidden">
          <CommunityTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="ml-4 shrink-0 rounded-full bg-white p-3 shadow-[0_10px_24px_rgba(17,24,39,0.08)]"
          >
            <Menu className="h-5 w-5 text-[#2f3138]" strokeWidth={2.2} />
          </button>
        </div>

        <div className="hidden xl:block">
          <CommunityTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_480px]">
          <section>
            {activeTab === "Posts" && (
              <h1 className="mb-8 text-5xl font-semibold tracking-[-0.04em] text-[#26262d]">
                Welcome to Vimaux Community!
              </h1>
            )}
            {activePanel}
          </section>

          <div className="hidden xl:block">
            <ProfileSidebar profile={profile} notifications={notifications} />
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[420px] overflow-y-auto bg-[#f7f7f8] p-4 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-full bg-white p-2 shadow-md"
              >
                <X className="h-5 w-5 text-[#2f3138]" strokeWidth={2.2} />
              </button>
            </div>

            <ProfileSidebar
              profile={profile}
              notifications={notifications}
            />
          </div>
        </div>
      )}
    </div>
  );
}