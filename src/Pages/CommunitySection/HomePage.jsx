
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Menu, X } from "lucide-react";

import CommunityHeader from "../../Components/CommunitySection/CommunityHeader";
import CommunityTabs from "../../Components/CommunitySection/CommunityTabs";
import PostComposer from "../../Components/CommunitySection/PostComposer";
import PostFeed from "../../Components/CommunitySection/PostFeed";
import ProfileSidebar from "../../Components/CommunitySection/ProfileSidebar";
import DocumentsPanel from "../../Components/CommunitySection/DocumentsPanel";
import ProjectsPanel from "../../Components/CommunitySection/ProjectsPanel";
import GalleryPanel from "../../Components/CommunitySection/GalleryPanel";

import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../lib/supabase";

const tabs = ["Posts", "Documents", "Project", "Gallery"];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationRefresh, setNotificationRefresh] = useState(0);

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const { user } = useAuth();

  console.log("USER IN HOMEPAGE:", user);

  const profile = {
    name: user?.fullName || "Community Member",
    email: user?.email || "",
    password: "************",
    avatarLetter: (user?.fullName || "C")
      .charAt(0)
      .toUpperCase(),
  };

  // ----------------------------------------
  // Check Supabase session
  // ----------------------------------------

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } =
        await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }

      console.log(
        "SUPABASE ACCESS TOKEN:",
        data.session?.access_token
      );
    };

    checkSession();
  }, []);

  // ----------------------------------------
  // Fetch projects
  // ----------------------------------------

  const fetchProjects = useCallback(async () => {
    if (!user?.id) {
      setProjects([]);
      setLoadingProjects(false);
      return;
    }

    setLoadingProjects(true);

    const { data, error } = await supabase
      .from("projects")
      .select(
        `
          id,
          title,
          description,
          start_date,
          end_date,
          image_file_name,
          image_file_key,
          image_file_type,
          image_file_size,
          created_by,
          created_at,
          updated_at
        `
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error fetching projects:",
        error
      );

      setProjects([]);
      setLoadingProjects(false);
      return;
    }

    setProjects(data || []);
    setLoadingProjects(false);
  }, [user?.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ----------------------------------------
  // Fetch notifications
  // ----------------------------------------

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        setNotifications([]);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select(
          "id, type, title, message, is_read, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error fetching notifications:",
          error
        );
        return;
      }

      setNotifications(data || []);
    };

    fetchNotifications();
  }, [user?.id, notificationRefresh]);

  // ----------------------------------------
  // Notification created
  // ----------------------------------------

  const handleNotificationCreated = () => {
    setNotificationRefresh(
      (current) => current + 1
    );
  };

  // ----------------------------------------
  // Fetch documents
  // ----------------------------------------

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user?.id) {
        setDocuments([]);
        setLoadingDocuments(false);
        return;
      }

      setLoadingDocuments(true);

      const { data, error } = await supabase
        .from("documents")
        .select(
          "id, title, description, file_name, file_type, file_size, is_confidential, uploaded_by, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error fetching documents:",
          error
        );

        setLoadingDocuments(false);
        return;
      }

      setDocuments(data || []);
      setLoadingDocuments(false);
    };

    fetchDocuments();
  }, [user?.id]);

  // ----------------------------------------
  // Fetch gallery
  // ----------------------------------------

  useEffect(() => {
    const fetchGallery = async () => {
      if (!user?.id) {
        setGalleryItems([]);
        setLoadingGallery(false);
        return;
      }

      setLoadingGallery(true);

      const { data, error } = await supabase
        .from("gallery")
        .select(
          "id, title, type, file_name, file_key, file_type, file_size, uploaded_by, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error fetching gallery:",
          error
        );

        setGalleryItems([]);
        setLoadingGallery(false);
        return;
      }

      setGalleryItems(data || []);
      setLoadingGallery(false);
    };

    fetchGallery();
  }, [user?.id]);

  // ----------------------------------------
  // Refresh gallery after upload
  // ----------------------------------------

  const handleGalleryUploaded = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select(
        "id, title, type, file_name, file_key, file_type, file_size, uploaded_by, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error refreshing gallery:",
        error
      );
      return;
    }

    setGalleryItems(data || []);
  };

  // ----------------------------------------
  // Sidebar notifications
  // ----------------------------------------

  const sidebarNotifications =
    notifications.map((notification) => ({
      ...notification,
      tone: notification.is_read
        ? "success"
        : "danger",
    }));

  // ----------------------------------------
  // Active panel
  // ----------------------------------------

  const activePanel = useMemo(() => {
    switch (activeTab) {
      case "Documents":
        return (
          <DocumentsPanel
            documents={documents}
            loading={loadingDocuments}
            currentUser={user}
            onDocumentUploaded={() => {
              window.location.reload();
            }}
          />
        );

      case "Project":
        return (
          <ProjectsPanel
            projects={projects}
            currentUser={user}
            loading={loadingProjects}
            onProjectCreated={fetchProjects}
          />
        );

      case "Gallery":
        return (
          <GalleryPanel
            items={galleryItems}
            currentUser={user}
            loading={loadingGallery}
            onGalleryUploaded={
              handleGalleryUploaded
            }
          />
        );

      case "Posts":
      default:
        return (
          <div className="w-full min-w-0 space-y-7">
            <PostComposer />
            <PostFeed />
          </div>
        );
    }
  }, [
    activeTab,
    documents,
    loadingDocuments,
    projects,
    loadingProjects,
    galleryItems,
    loadingGallery,
    user,
    fetchProjects,
  ]);

  // ----------------------------------------
  // Notifications realtime
  // ----------------------------------------

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log(
            "New notification received:",
            payload
          );

          setNotifications(
            (currentNotifications) => [
              payload.new,
              ...currentNotifications,
            ]
          );
        }
      )
      .subscribe((status) => {
        console.log(
          "Notifications realtime status:",
          status
        );
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f7f8] text-[#1f1f24]">
      <CommunityHeader title="Vimaux Community" />

      <main className="mx-auto w-full max-w-[1480px] min-w-0 px-4 pb-10 pt-2 sm:px-5 md:px-8 xl:px-10">
        {/* Mobile tabs */}
        <div className="mb-4 flex w-full min-w-0 items-center gap-3 xl:hidden">
          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="w-max min-w-full">
              <CommunityTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsSidebarOpen(true)
            }
            className="shrink-0 rounded-full bg-white p-3 shadow-[0_10px_24px_rgba(17,24,39,0.08)]"
          >
            <Menu
              className="h-5 w-5 text-[#2f3138]"
              strokeWidth={2.2}
            />
          </button>
        </div>

        {/* Desktop tabs */}
        <div className="hidden xl:block">
          <CommunityTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Main content */}
        <div className="mt-6 grid w-full min-w-0 gap-6 xl:mt-8 xl:grid-cols-[minmax(0,1.8fr)_480px] xl:gap-8">
          <section className="w-full min-w-0 overflow-hidden">
            {activeTab === "Posts" && (
              <h1 className="mb-6 max-w-full text-3xl font-semibold tracking-[-0.04em] text-[#26262d] sm:text-4xl xl:mb-8 xl:text-5xl">
                Welcome to Vimaux Community!
              </h1>
            )}

            <div className="w-full min-w-0">
              {activePanel}
            </div>
          </section>

          <div className="hidden min-w-0 xl:block">
            <ProfileSidebar
              profile={profile}
              notifications={
                sidebarNotifications
              }
              currentUser={user}
              onNotificationCreated={
                handleNotificationCreated
              }
            />
          </div>
        </div>
      </main>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setIsSidebarOpen(false)
            }
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[420px] overflow-y-auto bg-[#f7f7f8] p-4 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setIsSidebarOpen(false)
                }
                className="rounded-full bg-white p-2 shadow-md"
              >
                <X
                  className="h-5 w-5 text-[#2f3138]"
                  strokeWidth={2.2}
                />
              </button>
            </div>

            <ProfileSidebar
              profile={profile}
              notifications={
                sidebarNotifications
              }
              currentUser={user}
              onNotificationCreated={
                handleNotificationCreated
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}