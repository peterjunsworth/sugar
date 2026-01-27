'use client';

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  // Get initials from name
  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="profile-header">
      <div className="content-wrapper">
        <div className="avatar">{getInitials(name)}</div>
        <div>
          <div className="profile-name">{name}</div>
          <div className="profile-email">{email}</div>
        </div>
      </div>
    </div>
  );
}
