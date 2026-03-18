import { useState } from "react";
import {
  Camera,
  Check,
  Pencil,
  X,
  Users,
  ShieldCheck,
} from "lucide-react";

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
      <button className="shrink-0 text-[16px] font-medium text-[#355dbb] underline underline-offset-2">
        Change
      </button>
    </div>
  );
}

function PermissionToggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8fb] px-4 py-3">
      <span className="text-[15px] font-medium text-[#31323a]">{label}</span>

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

function MemberAccessCard({ member, onTogglePermission }) {
  return (
    <div className="rounded-[20px] border border-[#d9dce5] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2c2c31] text-[18px] text-white">
            {member.avatarLetter}
          </div>

          <div>
            <h4 className="text-[16px] font-semibold text-[#25262d]">
              {member.name}
            </h4>
            <p className="text-[14px] italic text-[#8b8d97]">{member.role}</p>
          </div>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            member.isAdmin
              ? "bg-[#e8efff] text-[#4169E1]"
              : "bg-[#f3f4f6] text-[#666b76]"
          }`}
        >
          {member.isAdmin ? "Admin" : "Member"}
        </div>
      </div>

      <div className="space-y-3">
        <PermissionToggle
          label="Create Access"
          checked={member.permissions.create}
          onChange={() => onTogglePermission(member.id, "create")}
        />
        <PermissionToggle
          label="Update Access"
          checked={member.permissions.update}
          onChange={() => onTogglePermission(member.id, "update")}
        />
        <PermissionToggle
          label="Delete Access"
          checked={member.permissions.delete}
          onChange={() => onTogglePermission(member.id, "delete")}
        />
      </div>
    </div>
  );
}

export default function ProfileSidebar({ profile, notifications }) {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Test man",
      role: "Community admin",
      avatarLetter: "T",
      isAdmin: true,
      permissions: {
        create: true,
        update: true,
        delete: true,
      },
    },
    {
      id: 2,
      name: "Sarah John",
      role: "Community member",
      avatarLetter: "S",
      isAdmin: false,
      permissions: {
        create: true,
        update: false,
        delete: false,
      },
    },
    {
      id: 3,
      name: "Michael Lee",
      role: "Community member",
      avatarLetter: "M",
      isAdmin: false,
      permissions: {
        create: false,
        update: true,
        delete: false,
      },
    },
    {
      id: 4,
      name: "Anna Kate",
      role: "Community member",
      avatarLetter: "A",
      isAdmin: false,
      permissions: {
        create: false,
        update: false,
        delete: false,
      },
    },
  ]);

  const handleTogglePermission = (memberId, permissionKey) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id !== memberId || member.isAdmin) return member;

        return {
          ...member,
          permissions: {
            ...member.permissions,
            [permissionKey]: !member.permissions[permissionKey],
          },
        };
      })
    );
  };

  return (
    <aside className="rounded-[24px] border border-[#ececf0] bg-[#fbfbfc] px-6 py-7 shadow-[0_18px_40px_rgba(17,24,39,0.04)]">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="flex h-[102px] w-[102px] items-center justify-center rounded-full bg-[#2c2c31] text-[42px] text-white shadow-sm">
            {profile.avatarLetter}
          </div>
          <button className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-[#88a2ff] text-white shadow-md">
            <Camera className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <h3 className="text-[17px] font-medium italic text-[#272832]">
            {profile.name}
          </h3>
          <Pencil className="h-4 w-4 text-[#5f6371]" strokeWidth={2} />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <SidebarRow label="Email" value={profile.email} />
        <SidebarRow label="Password" value={profile.password} />
      </div>

      <div className="mt-16">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-[18px] italic text-[#9ea0aa]">Notification</span>
          <div className="h-px flex-1 bg-[#dbdde4]" />
        </div>

        <div className="space-y-4">
          {notifications.map((item) => (
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
                  <X className="h-5 w-5" strokeWidth={2.4} />
                ) : (
                  <Check className="h-5 w-5" strokeWidth={2.4} />
                )}
              </div>
              <p className="text-[16px] leading-6 text-[#20222a]">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
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
            As community admin, you can manage members and delegate Create,
            Update, and Delete permissions.
          </p>
        </div>

        <div className="space-y-4">
          {members.map((member) => (
            <MemberAccessCard
              key={member.id}
              member={member}
              onTogglePermission={handleTogglePermission}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}