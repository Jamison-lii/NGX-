
import { useEffect, useState } from "react";
import {
  Camera,
  Check,
  Pencil,
  X,
  Users,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

function SidebarRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#dddddf] pb-4">
      <div className="min-w-0">
        <span className="mr-2 text-[17px] font-medium text-[#2b2c33]">
          {label}:
        </span>

        <span className="break-all text-[17px] italic text-[#8b8d97]">
          {value}
        </span>
      </div>

    {/**  <button className="shrink-0 text-[16px] font-medium text-[#355dbb] underline underline-offset-2">
        Change
      </button>*/}
    </div>
  );
}

function PermissionToggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8fb] px-4 py-3">
      <span className="text-[15px] font-medium text-[#31323a]">
        {label}
      </span>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-[#4169E1]" : "bg-[#d6d9e2]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

function MemberAccessCard({
  member,
  onTogglePermission,
  onToggleActive,
}) {
  if (!member) {
    return null;
  }

  const avatarLetter = (member.full_name || "C")
    .charAt(0)
    .toUpperCase();

  const isAdmin = member.role === "admin";

  return (
    <div className="rounded-[20px] border border-[#d9dce5] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2c2c31] text-[18px] text-white">
            {avatarLetter}
          </div>

          <div>
            <h4 className="text-[16px] font-semibold text-[#25262d]">
              {member.full_name || "Community Member"}
            </h4>

            <p className="text-[14px] italic text-[#8b8d97]">
              {isAdmin
                ? "Community admin"
                : "Community member"}
            </p>
          </div>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isAdmin
              ? "bg-[#e8efff] text-[#4169E1]"
              : "bg-[#f3f4f6] text-[#666b76]"
          }`}
        >
          {isAdmin ? "Admin" : "Member"}
        </div>
      </div>

      {!isAdmin && (
        <>
          <div className="space-y-3">
            <PermissionToggle
              label="Create Access"
              checked={
                member.permissions?.can_create_posts ??
                false
              }
              onChange={() =>
                onTogglePermission(
                  member.id,
                  "can_create_posts"
                )
              }
            />

            <PermissionToggle
              label="Update Access"
              checked={
                member.permissions?.can_update_posts ??
                false
              }
              onChange={() =>
                onTogglePermission(
                  member.id,
                  "can_update_posts"
                )
              }
            />

            <PermissionToggle
              label="Delete Access"
              checked={
                member.permissions?.can_delete_posts ??
                false
              }
              onChange={() =>
                onTogglePermission(
                  member.id,
                  "can_delete_posts"
                )
              }
            />
          </div>

          <button
            type="button"
            onClick={() => onToggleActive(member)}
            className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              member.is_active
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {member.is_active
              ? "Deactivate member"
              : "Activate member"}
          </button>
        </>
      )}

      {isAdmin && (
        <div className="mt-3 rounded-xl bg-[#f3f4f6] px-4 py-3 text-center text-sm font-medium text-[#666b76]">
          Full admin access
        </div>
      )}
    </div>
  );
}

export default function ProfileSidebar({
  profile,
  notifications,
  currentUser,
  onNotificationCreated,
}) {
  const isAdmin = currentUser?.role === "admin";

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  console.log("PROFILE SIDEBAR IS RENDERING");
  console.log("CURRENT USER:", currentUser);
  console.log("IS ADMIN:", isAdmin);

  const handleTogglePermission = async (
    memberId,
    permissionKey
  ) => {
    const member = members.find(
      (item) => item.id === memberId
    );

    if (!member) {
      return;
    }

    const currentValue =
      member.permissions?.[permissionKey] ?? false;

    const newValue = !currentValue;

    const { error } = await supabase
      .from("member_permissions")
      .update({
        [permissionKey]: newValue,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", memberId);

    if (error) {
      console.error(
        "Error updating permission:",
        error
      );
      alert(error.message);
      return;
    }

    setMembers((currentMembers) =>
      currentMembers.map((currentMember) =>
        currentMember.id === memberId
          ? {
              ...currentMember,
              permissions: {
                ...currentMember.permissions,
                [permissionKey]: newValue,
              },
            }
          : currentMember
      )
    );

    const permissionNames = {
      can_create_posts: {
        granted: "Create Access Granted",
        revoked: "Create Access Removed",
        grantedMessage:
          "You can now create community posts.",
        revokedMessage:
          "Your access to create community posts has been removed.",
      },

      can_update_posts: {
        granted: "Update Access Granted",
        revoked: "Update Access Removed",
        grantedMessage:
          "You can now edit your own community posts.",
        revokedMessage:
          "Your access to edit community posts has been removed.",
      },

      can_delete_posts: {
        granted: "Delete Access Granted",
        revoked: "Delete Access Removed",
        grantedMessage:
          "You can now delete your own community posts.",
        revokedMessage:
          "Your access to delete community posts has been removed.",
      },
    };

    const notification =
      permissionNames[permissionKey];

    if (notification) {
      const { error: notificationError } =
        await supabase
          .from("notifications")
          .insert({
            user_id: memberId,
            type: "permission",
            title: newValue
              ? notification.granted
              : notification.revoked,
            message: newValue
              ? notification.grantedMessage
              : notification.revokedMessage,
          });

      if (notificationError) {
        console.error(
          "Error creating notification:",
          notificationError
        );

        alert(
          `Permission changed, but notification could not be created: ${notificationError.message}`
        );

        return;
      }

      console.log(
        "Notification created successfully"
      );

      if (onNotificationCreated) {
        onNotificationCreated();
      }
    }
  };

  const handleToggleActive = async (member) => {
    const newStatus = !member.is_active;

    const confirmed = window.confirm(
      `${newStatus ? "Activate" : "Deactivate"} ${
        member.full_name
      }?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        is_active: newStatus,
      })
      .eq("id", member.id);

    if (error) {
      console.error(
        "Error updating member:",
        error
      );
      alert(error.message);
      return;
    }

    setMembers((currentMembers) =>
      currentMembers.map((currentMember) =>
        currentMember.id === member.id
          ? {
              ...currentMember,
              is_active: newStatus,
            }
          : currentMember
      )
    );
  };

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isAdmin) {
        setLoadingMembers(false);
        return;
      }

      const {
        data: profiles,
        error: profilesError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, role, is_active, created_at"
        )
        .order("created_at", {
          ascending: true,
        });

      if (profilesError) {
        console.error(
          "Error fetching members:",
          profilesError
        );
        setLoadingMembers(false);
        return;
      }

      const {
        data: permissions,
        error: permissionsError,
      } = await supabase
        .from("member_permissions")
        .select(
          "user_id, can_create_posts, can_update_posts, can_delete_posts"
        );

      if (permissionsError) {
        console.error(
          "Error fetching permissions:",
          permissionsError
        );
        setLoadingMembers(false);
        return;
      }

      const membersWithPermissions =
        (profiles || []).map((profile) => {
          const permission = (
            permissions || []
          ).find(
            (item) =>
              item.user_id === profile.id
          );

          return {
            ...profile,
            permissions: permission || {
              can_create_posts: false,
              can_update_posts: false,
              can_delete_posts: false,
            },
          };
        });

      setMembers(membersWithPermissions);
      setLoadingMembers(false);
    };

    fetchMembers();
  }, [isAdmin]);

  return (
    <aside className="rounded-[24px] border border-[#ececf0] bg-[#fbfbfc] px-6 py-7 shadow-[0_18px_40px_rgba(17,24,39,0.04)]">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="flex h-[102px] w-[102px] items-center justify-center rounded-full bg-[#2c2c31] text-[42px] text-white shadow-sm">
            {profile.avatarLetter}
          </div>

          <button className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-[#88a2ff] text-white shadow-md">
            <Camera
              className="h-5 w-5"
              strokeWidth={2.2}
            />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <h3 className="text-[17px] font-medium italic text-[#272832]">
            {profile.name}
          </h3>

          <Pencil
            className="h-4 w-4 text-[#5f6371]"
            strokeWidth={2}
          />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <SidebarRow
          label="Email"
          value={profile.email}
        />

        <SidebarRow
          label="Password"
          value={profile.password}
        />
      </div>

      <div className="mt-16">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[18px] italic text-[#9ea0aa]">
            Notification
          </span>

          <div className="h-px flex-1 bg-[#dbdde4]" />
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-sm text-[#8b8d97]">
              No notifications yet.
            </p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-[18px] border border-[#d6d8df] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.04)]"
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    item.tone === "danger"
                      ? "bg-[#ff4a4a] text-white"
                      : "bg-[#54cb61] text-white"
                  }`}
                >
                  {item.tone === "danger" ? (
                    <X
                      className="h-5 w-5"
                      strokeWidth={2.4}
                    />
                  ) : (
                    <Check
                      className="h-5 w-5"
                      strokeWidth={2.4}
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-[#20222a]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[16px] leading-6 text-[#4c4e57]">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-16">
          <section>
            <div className="mb-6 flex items-center gap-4">
              <span className="flex items-center gap-2 text-[18px] italic text-[#9ea0aa]">
                <Users className="h-5 w-5" />
                Member Access
              </span>

              <div className="h-px flex-1 bg-[#dbdde4]" />
            </div>

            <div className="mb-4 flex items-start gap-3 rounded-[18px] border border-[#d7e2ff] bg-[#eef4ff] px-4 py-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#4169E1]" />

              <p className="text-[14px] leading-6 text-[#3a4b7a]">
                As community admin, you can manage
                members and delegate Create, Update,
                and Delete permissions.
              </p>
            </div>

            <div className="space-y-4">
              {loadingMembers ? (
                <p className="text-sm text-[#8b8d97]">
                  Loading members...
                </p>
              ) : members.length === 0 ? (
                <p className="text-sm text-[#8b8d97]">
                  No members found.
                </p>
              ) : (
                members
                  .filter(Boolean)
                  .map((member) => (
                    <MemberAccessCard
                      key={member.id}
                      member={member}
                      onTogglePermission={
                        handleTogglePermission
                      }
                      onToggleActive={
                        handleToggleActive
                      }
                    />
                  ))
              )}
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}
