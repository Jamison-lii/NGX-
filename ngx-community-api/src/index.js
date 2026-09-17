
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://ngx-demo.vercel.app",
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, X-File-Name",
  "Access-Control-Allow-Methods":
    "GET, POST, OPTIONS, DELETE",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

// ----------------------------------------
// Get authenticated Supabase user
// ----------------------------------------

async function getAuthenticatedUser(request, env) {
  const authorization =
    request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const accessToken = authorization.replace(
    "Bearer ",
    ""
  );

  const response = await fetch(
    `${env.SUPABASE_URL}/auth/v1/user`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Supabase authentication failed:",
      response.status
    );

    return null;
  }

  const user = await response.json();

  return {
    ...user,
    access_token: accessToken,
  };
}

// ----------------------------------------
// Get user's profile
// ----------------------------------------

async function getUserProfile(user, env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(
      user.id
    )}&select=id,role,is_active`,
    {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Profile request failed:",
      response.status
    );

    return null;
  }

  const profiles = await response.json();

  if (profiles.length === 0) {
    return null;
  }

  return profiles[0];
}

// ----------------------------------------
// Check admin
// ----------------------------------------

async function isAdmin(user, env) {
  const profile = await getUserProfile(
    user,
    env
  );

  return (
    profile?.role === "admin" &&
    profile?.is_active === true
  );
}

// ----------------------------------------
// Sanitize file names
// ----------------------------------------

function sanitizeFileName(fileName) {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

// ----------------------------------------
// Get document from Supabase
// ----------------------------------------

async function getDocument(
  documentId,
  user,
  env
) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/documents?id=eq.${encodeURIComponent(
      documentId
    )}&select=id,title,file_name,file_key,file_type,file_size,is_confidential,uploaded_by`,
    {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Document request failed:",
      response.status
    );

    return null;
  }

  const documents = await response.json();

  if (documents.length === 0) {
    return null;
  }

  return documents[0];
}

// ----------------------------------------
// Get gallery item from Supabase
// ----------------------------------------

async function getGalleryItem(
  galleryId,
  user,
  env
) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/gallery?id=eq.${encodeURIComponent(
      galleryId
    )}&select=id,title,type,file_name,file_key,file_type,file_size,uploaded_by,created_at`,
    {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Gallery request failed:",
      response.status
    );

    return null;
  }

  const galleryItems = await response.json();

  if (galleryItems.length === 0) {
    return null;
  }

  return galleryItems[0];
}

// ----------------------------------------
// Get project from Supabase
// ----------------------------------------

async function getProject(
  projectId,
  user,
  env
) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/projects?id=eq.${encodeURIComponent(
      projectId
    )}&select=id,title,description,start_date,end_date,image_file_name,image_file_key,image_file_type,image_file_size,created_by,created_at,updated_at`,
    {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Project request failed:",
      response.status
    );

    return null;
  }

  const projects = await response.json();

  if (projects.length === 0) {
    return null;
  }

  return projects[0];
}

// ----------------------------------------
// Check document access
// ----------------------------------------

async function canAccessDocument(
  document,
  user,
  env
) {
  const profile = await getUserProfile(
    user,
    env
  );

  if (!profile) {
    return false;
  }

  if (!profile.is_active) {
    return false;
  }

  if (profile.role === "admin") {
    return true;
  }

  if (!document.is_confidential) {
    return true;
  }

  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/document_access?document_id=eq.${encodeURIComponent(
      document.id
    )}&user_id=eq.${encodeURIComponent(
      user.id
    )}&select=document_id`,
    {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Document access request failed:",
      response.status
    );

    return false;
  }

  const accessRows = await response.json();

  return accessRows.length > 0;
}

// ----------------------------------------
// Worker
// ----------------------------------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ------------------------------------
    // CORS PREFLIGHT
    // ------------------------------------

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // ------------------------------------
    // API HEALTH CHECK
    // ------------------------------------

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {
      return jsonResponse({
        message:
          "NGX Community API is running",
        r2Connected:
          !!env.COMMUNITY_FILES,
      });
    }

    // ------------------------------------
    // PUBLIC PROJECT IMAGE VIEW
    // ------------------------------------

    if (
      request.method === "GET" &&
      url.pathname.startsWith(
        "/public/projects/"
      )
    ) {
      const projectId =
        url.pathname.replace(
          "/public/projects/",
          ""
        );

      if (!projectId) {
        return jsonResponse(
          {
            error:
              "Project ID is required",
          },
          400
        );
      }

      if (!env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error(
          "SUPABASE_SERVICE_ROLE_KEY is not configured"
        );

        return jsonResponse(
          {
            error:
              "Server configuration error",
          },
          500
        );
      }

      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/projects?id=eq.${encodeURIComponent(
          projectId
        )}&select=id,image_file_name,image_file_key,image_file_type`,
        {
          headers: {
            apikey:
              env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization:
              `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Public project request failed:",
          response.status
        );

        return jsonResponse(
          {
            error:
              "Failed to load project",
          },
          500
        );
      }

      const projects =
        await response.json();

      if (projects.length === 0) {
        return jsonResponse(
          {
            error:
              "Project not found",
          },
          404
        );
      }

      const project = projects[0];

      if (!project.image_file_key) {
        return jsonResponse(
          {
            error:
              "Project image not found",
          },
          404
        );
      }

      let object;

      try {
        object =
          await env.COMMUNITY_FILES.get(
            project.image_file_key
          );
      } catch (error) {
        console.error(
          "Public project R2 request failed:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to load project image",
          },
          500
        );
      }

      if (!object) {
        return jsonResponse(
          {
            error:
              "Project image not found in storage",
          },
          404
        );
      }

      const headers = new Headers(
        corsHeaders
      );

      headers.set(
        "Content-Type",
        project.image_file_type ||
          "application/octet-stream"
      );

      headers.set(
        "Content-Length",
        String(object.size)
      );

      headers.set(
        "Content-Disposition",
        `inline; filename="${sanitizeFileName(
          project.image_file_name ||
            "project-image"
        )}"`
      );

      headers.set(
        "Cache-Control",
        "public, max-age=300"
      );

      return new Response(
        object.body,
        {
          status: 200,
          headers,
        }
      );
    }

    // ------------------------------------
    // PUBLIC GALLERY MEDIA VIEW
    // ------------------------------------

    if (
      request.method === "GET" &&
      url.pathname.startsWith(
        "/public/gallery/"
      )
    ) {
      const galleryId =
        url.pathname.replace(
          "/public/gallery/",
          ""
        );

      if (!galleryId) {
        return jsonResponse(
          {
            error:
              "Gallery ID is required",
          },
          400
        );
      }

      if (!env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error(
          "SUPABASE_SERVICE_ROLE_KEY is not configured"
        );

        return jsonResponse(
          {
            error:
              "Server configuration error",
          },
          500
        );
      }

      try {
        const response = await fetch(
          `${env.SUPABASE_URL}/rest/v1/gallery?id=eq.${encodeURIComponent(
            galleryId
          )}&select=id,title,type,file_name,file_key,file_type`,
          {
            headers: {
              apikey:
                env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization:
                `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
          }
        );

        if (!response.ok) {
          const errorText =
            await response.text();

          console.error(
            "Public gallery Supabase error:",
            errorText
          );

          return jsonResponse(
            {
              error:
                "Failed to fetch gallery item.",
            },
            500
          );
        }

        const galleryItems =
          await response.json();

        if (!galleryItems.length) {
          return jsonResponse(
            {
              error:
                "Gallery item not found.",
            },
            404
          );
        }

        const item = galleryItems[0];

        if (!item.file_key) {
          return jsonResponse(
            {
              error:
                "Gallery file not found.",
            },
            404
          );
        }

        let object;

        try {
          object =
            await env.COMMUNITY_FILES.get(
              item.file_key
            );
        } catch (error) {
          console.error(
            "Public gallery R2 request failed:",
            error
          );

          return jsonResponse(
            {
              error:
                "Failed to load gallery file.",
            },
            500
          );
        }

        if (!object) {
          return jsonResponse(
            {
              error:
                "Gallery file not found in storage.",
            },
            404
          );
        }

        const headers = new Headers(
          corsHeaders
        );

        headers.set(
          "Content-Type",
          item.file_type ||
            "application/octet-stream"
        );

        headers.set(
          "Content-Length",
          String(object.size)
        );

        headers.set(
          "Content-Disposition",
          `inline; filename="${sanitizeFileName(
            item.file_name ||
              "gallery-media"
          )}"`
        );

        headers.set(
          "Cache-Control",
          "public, max-age=3600"
        );

        return new Response(
          object.body,
          {
            status: 200,
            headers,
          }
        );
      } catch (error) {
        console.error(
          "Public gallery error:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to load gallery item.",
          },
          500
        );
      }
    }

    // ------------------------------------
    // DOCUMENT UPLOAD
    // ------------------------------------

    if (
      request.method === "POST" &&
      url.pathname === "/upload"
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const admin =
        await isAdmin(
          user,
          env
        );

      if (!admin) {
        return jsonResponse(
          {
            error:
              "Admin access required",
          },
          403
        );
      }

      if (!request.body) {
        return jsonResponse(
          {
            error:
              "No file provided",
          },
          400
        );
      }

      const originalFileName =
        request.headers.get(
          "X-File-Name"
        );

      if (!originalFileName) {
        return jsonResponse(
          {
            error:
              "X-File-Name header is required",
          },
          400
        );
      }

      const fileName =
        sanitizeFileName(
          originalFileName
        );

      if (!fileName) {
        return jsonResponse(
          {
            error:
              "Invalid file name",
          },
          400
        );
      }

      const contentType =
        request.headers.get(
          "Content-Type"
        ) ||
        "application/octet-stream";

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ];

      if (!allowedTypes.includes(contentType)) {
        return jsonResponse(
          {
            error:
              `File type not allowed: ${contentType}`,
          },
          400
        );
      }

      const contentLength =
        request.headers.get(
          "Content-Length"
        );

      if (
        contentLength &&
        Number(contentLength) >
          50 * 1024 * 1024
      ) {
        return jsonResponse(
          {
            error:
              "File is too large. Maximum file size is 50 MB.",
          },
          400
        );
      }

      const fileKey =
        `documents/${crypto.randomUUID()}-${fileName}`;

      try {
        await env.COMMUNITY_FILES.put(
          fileKey,
          request.body,
          {
            httpMetadata: {
              contentType,
            },
            customMetadata: {
              originalFileName,
              uploadedBy: user.id,
            },
          }
        );
      } catch (error) {
        console.error(
          "R2 upload failed:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to upload file to storage",
          },
          500
        );
      }

      return jsonResponse({
        message:
          "File uploaded successfully",
        fileKey,
        fileName:
          originalFileName,
        sanitizedFileName:
          fileName,
        contentType,
        uploadedBy:
          user.id,
      });
    }

    // ------------------------------------
    // PROJECT IMAGE UPLOAD
    // ------------------------------------

    if (
      request.method === "POST" &&
      url.pathname ===
        "/projects/upload"
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const admin =
        await isAdmin(
          user,
          env
        );

      if (!admin) {
        return jsonResponse(
          {
            error:
              "Admin access required",
          },
          403
        );
      }

      if (!request.body) {
        return jsonResponse(
          {
            error:
              "No file provided",
          },
          400
        );
      }

      const originalFileName =
        request.headers.get(
          "X-File-Name"
        );

      if (!originalFileName) {
        return jsonResponse(
          {
            error:
              "X-File-Name header is required",
          },
          400
        );
      }

      const fileName =
        sanitizeFileName(
          originalFileName
        );

      if (!fileName) {
        return jsonResponse(
          {
            error:
              "Invalid file name",
          },
          400
        );
      }

      const contentType =
        request.headers.get(
          "Content-Type"
        ) ||
        "application/octet-stream";

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (
        !allowedTypes.includes(
          contentType
        )
      ) {
        return jsonResponse(
          {
            error:
              `File type not allowed: ${contentType}`,
          },
          400
        );
      }

      const contentLength =
        request.headers.get(
          "Content-Length"
        );

      if (
        contentLength &&
        Number(contentLength) >
          100 * 1024 * 1024
      ) {
        return jsonResponse(
          {
            error:
              "File is too large. Maximum file size is 100 MB.",
          },
          400
        );
      }

      const fileKey =
        `projects/${crypto.randomUUID()}-${fileName}`;

      try {
        await env.COMMUNITY_FILES.put(
          fileKey,
          request.body,
          {
            httpMetadata: {
              contentType,
            },
            customMetadata: {
              originalFileName,
              uploadedBy: user.id,
              source: "projects",
            },
          }
        );
      } catch (error) {
        console.error(
          "Project R2 upload failed:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to upload project image to storage",
          },
          500
        );
      }

      return jsonResponse({
        message:
          "Project image uploaded successfully",
        fileKey,
        fileName:
          originalFileName,
        sanitizedFileName:
          fileName,
        contentType,
        uploadedBy:
          user.id,
      });
    }

    // ------------------------------------
    // DOCUMENT DOWNLOAD
    // ------------------------------------

    if (
      request.method === "GET" &&
      url.pathname.startsWith(
        "/download/"
      )
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const documentId =
        url.pathname.replace(
          "/download/",
          ""
        );

      if (!documentId) {
        return jsonResponse(
          {
            error:
              "Document ID is required",
          },
          400
        );
      }

      const document =
        await getDocument(
          documentId,
          user,
          env
        );

      if (!document) {
        return jsonResponse(
          {
            error:
              "Document not found",
          },
          404
        );
      }

      const allowed =
        await canAccessDocument(
          document,
          user,
          env
        );

      if (!allowed) {
        return jsonResponse(
          {
            error:
              "You do not have access to this document",
          },
          403
        );
      }

      const object =
        await env.COMMUNITY_FILES.get(
          document.file_key
        );

      if (!object) {
        return jsonResponse(
          {
            error:
              "File not found in storage",
          },
          404
        );
      }

      const headers = new Headers(
        corsHeaders
      );

      headers.set(
        "Content-Type",
        document.file_type ||
          "application/octet-stream"
      );

      headers.set(
        "Content-Length",
        String(object.size)
      );

      headers.set(
        "Content-Disposition",
        `attachment; filename="${sanitizeFileName(
          document.file_name
        )}"`
      );

      return new Response(
        object.body,
        {
          status: 200,
          headers,
        }
      );
    }

    // ------------------------------------
    // GALLERY UPLOAD
    // ------------------------------------

    if (
      request.method === "POST" &&
      url.pathname ===
        "/gallery/upload"
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const admin =
        await isAdmin(
          user,
          env
        );

      if (!admin) {
        return jsonResponse(
          {
            error:
              "Admin access required",
          },
          403
        );
      }

      if (!request.body) {
        return jsonResponse(
          {
            error:
              "No file provided",
          },
          400
        );
      }

      const originalFileName =
        request.headers.get(
          "X-File-Name"
        );

      if (!originalFileName) {
        return jsonResponse(
          {
            error:
              "X-File-Name header is required",
          },
          400
        );
      }

      const fileName =
        sanitizeFileName(
          originalFileName
        );

      if (!fileName) {
        return jsonResponse(
          {
            error:
              "Invalid file name",
          },
          400
        );
      }

      const contentType =
        request.headers.get(
          "Content-Type"
        ) ||
        "application/octet-stream";

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];

      if (!allowedTypes.includes(contentType)) {
        return jsonResponse(
          {
            error:
              `File type not allowed: ${contentType}`,
          },
          400
        );
      }

      const contentLength =
        request.headers.get(
          "Content-Length"
        );

      if (
        contentLength &&
        Number(contentLength) >
          100 * 1024 * 1024
      ) {
        return jsonResponse(
          {
            error:
              "File is too large. Maximum file size is 100 MB.",
          },
          400
        );
      }

      const fileKey =
        `gallery/${crypto.randomUUID()}-${fileName}`;

      try {
        await env.COMMUNITY_FILES.put(
          fileKey,
          request.body,
          {
            httpMetadata: {
              contentType,
            },
            customMetadata: {
              originalFileName,
              uploadedBy: user.id,
              source: "gallery",
            },
          }
        );
      } catch (error) {
        console.error(
          "Gallery R2 upload failed:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to upload gallery media to storage",
          },
          500
        );
      }

      return jsonResponse({
        message:
          "Gallery media uploaded successfully",
        fileKey,
        fileName:
          originalFileName,
        sanitizedFileName:
          fileName,
        contentType,
        uploadedBy:
          user.id,
      });
    }

    // ------------------------------------
    // GALLERY VIEW
    // ------------------------------------

    if (
      request.method === "GET" &&
      url.pathname.startsWith(
        "/gallery/"
      )
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const profile =
        await getUserProfile(
          user,
          env
        );

      if (!profile) {
        return jsonResponse(
          {
            error:
              "User profile not found",
          },
          404
        );
      }

      if (!profile.is_active) {
        return jsonResponse(
          {
            error:
              "Your account is inactive",
          },
          403
        );
      }

      const galleryId =
        url.pathname.replace(
          "/gallery/",
          ""
        );

      if (!galleryId) {
        return jsonResponse(
          {
            error:
              "Gallery item ID is required",
          },
          400
        );
      }

      const galleryItem =
        await getGalleryItem(
          galleryId,
          user,
          env
        );

      if (!galleryItem) {
        return jsonResponse(
          {
            error:
              "Gallery item not found",
          },
          404
        );
      }

      let object;

      try {
        object =
          await env.COMMUNITY_FILES.get(
            galleryItem.file_key
          );
      } catch (error) {
        console.error(
          "Gallery R2 download failed:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to load gallery media",
          },
          500
        );
      }

      if (!object) {
        return jsonResponse(
          {
            error:
              "Gallery file not found in storage",
          },
          404
        );
      }

      const headers = new Headers(
        corsHeaders
      );

      headers.set(
        "Content-Type",
        galleryItem.file_type ||
          "application/octet-stream"
      );

      headers.set(
        "Content-Length",
        String(object.size)
      );

      headers.set(
        "Content-Disposition",
        `inline; filename="${sanitizeFileName(
          galleryItem.file_name
        )}"`
      );

      headers.set(
        "Cache-Control",
        "private, max-age=300"
      );

      return new Response(
        object.body,
        {
          status: 200,
          headers,
        }
      );
    }

    // ------------------------------------
    // GALLERY DELETE
    // ------------------------------------

    if (
      request.method === "DELETE" &&
      url.pathname.startsWith(
        "/gallery/"
      )
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const admin =
        await isAdmin(
          user,
          env
        );

      if (!admin) {
        return jsonResponse(
          {
            error:
              "Admin access required",
          },
          403
        );
      }

      const galleryId =
        url.pathname.replace(
          "/gallery/",
          ""
        );

      if (!galleryId) {
        return jsonResponse(
          {
            error:
              "Gallery item ID is required",
          },
          400
        );
      }

      const galleryItem =
        await getGalleryItem(
          galleryId,
          user,
          env
        );

      if (!galleryItem) {
        return jsonResponse(
          {
            error:
              "Gallery item not found",
          },
          404
        );
      }

      try {
        await env.COMMUNITY_FILES.delete(
          galleryItem.file_key
        );
      } catch (error) {
        console.error(
          "Gallery R2 delete failed:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to delete gallery media from storage",
          },
          500
        );
      }

      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/gallery?id=eq.${encodeURIComponent(
          galleryId
        )}`,
        {
          method: "DELETE",
          headers: {
            apikey:
              env.SUPABASE_PUBLISHABLE_KEY,
            Authorization:
              `Bearer ${user.access_token}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Gallery database delete failed:",
          response.status
        );

        return jsonResponse(
          {
            error:
              "File was removed from storage, but gallery record could not be deleted",
          },
          500
        );
      }

      return jsonResponse({
        message:
          "Gallery item deleted successfully",
        galleryId,
      });
    }

    // ------------------------------------
    // PROJECT IMAGE VIEW
    // ------------------------------------

    if (
      request.method === "GET" &&
      url.pathname.startsWith(
        "/projects/"
      )
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const profile =
        await getUserProfile(
          user,
          env
        );

      if (!profile) {
        return jsonResponse(
          {
            error:
              "User profile not found",
          },
          404
        );
      }

      if (!profile.is_active) {
        return jsonResponse(
          {
            error:
              "Your account is inactive",
          },
          403
        );
      }

      const projectId =
        url.pathname.replace(
          "/projects/",
          ""
        );

      if (!projectId) {
        return jsonResponse(
          {
            error:
              "Project ID is required",
          },
          400
        );
      }

      const project =
        await getProject(
          projectId,
          user,
          env
        );

      if (!project) {
        return jsonResponse(
          {
            error:
              "Project not found",
          },
          404
        );
      }

      if (!project.image_file_key) {
        return jsonResponse(
          {
            error:
              "Project image not found",
          },
          404
        );
      }

      let object;

      try {
        object =
          await env.COMMUNITY_FILES.get(
            project.image_file_key
          );
      } catch (error) {
        console.error(
          "Project R2 download failed:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to load project image",
          },
          500
        );
      }

      if (!object) {
        return jsonResponse(
          {
            error:
              "Project image not found in storage",
          },
          404
        );
      }

      const headers = new Headers(
        corsHeaders
      );

      headers.set(
        "Content-Type",
        project.image_file_type ||
          "application/octet-stream"
      );

      headers.set(
        "Content-Length",
        String(object.size)
      );

      headers.set(
        "Content-Disposition",
        `inline; filename="${sanitizeFileName(
          project.image_file_name ||
            "project-image"
        )}"`
      );

      headers.set(
        "Cache-Control",
        "private, max-age=300"
      );

      return new Response(
        object.body,
        {
          status: 200,
          headers,
        }
      );
    }

    // ------------------------------------
    // PROJECT DELETE
    // ------------------------------------

    if (
      request.method === "DELETE" &&
      url.pathname.startsWith(
        "/projects/"
      )
    ) {
      const user =
        await getAuthenticatedUser(
          request,
          env
        );

      if (!user) {
        return jsonResponse(
          {
            error:
              "Authentication required",
          },
          401
        );
      }

      const admin =
        await isAdmin(
          user,
          env
        );

      if (!admin) {
        return jsonResponse(
          {
            error:
              "Admin access required",
          },
          403
        );
      }

      const projectId =
        url.pathname.replace(
          "/projects/",
          ""
        );

      if (!projectId) {
        return jsonResponse(
          {
            error:
              "Project ID is required",
          },
          400
        );
      }

      const project =
        await getProject(
          projectId,
          user,
          env
        );

      if (!project) {
        return jsonResponse(
          {
            error:
              "Project not found",
          },
          404
        );
      }

      // Delete image from R2 first
      if (project.image_file_key) {
        try {
          await env.COMMUNITY_FILES.delete(
            project.image_file_key
          );
        } catch (error) {
          console.error(
            "Project R2 delete failed:",
            error
          );

          return jsonResponse(
            {
              error:
                "Failed to delete project image from storage",
            },
            500
          );
        }
      }

      // Delete project from Supabase
      const response =
        await fetch(
          `${env.SUPABASE_URL}/rest/v1/projects?id=eq.${encodeURIComponent(
            projectId
          )}`,
          {
            method: "DELETE",
            headers: {
              apikey:
                env.SUPABASE_PUBLISHABLE_KEY,
              Authorization:
                `Bearer ${user.access_token}`,
            },
          }
        );

      if (!response.ok) {
        console.error(
          "Project database delete failed:",
          response.status
        );

        return jsonResponse(
          {
            error:
              "Project image was deleted from storage, but the project record could not be deleted",
          },
          500
        );
      }

      return jsonResponse({
        message:
          "Project deleted successfully",
        projectId,
      });
    }

    // ------------------------------------
    // Route not found
    // ------------------------------------

    return jsonResponse(
      {
        error:
          "Route not found",
      },
      404
    );
  },
};

