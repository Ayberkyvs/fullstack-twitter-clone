import React from "react";
import { UserType } from "../../utils/types";
import Avatar from "../common/Avatar";
import findBadge from "../../utils/findBadge";

const User = ({
  user,
  rightButton,
  showBio = false,
}: {
  user: UserType;
  rightButton?: React.ReactNode;
  showBio?: boolean;
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-start w-full h-fit gap-3">
      <Avatar user={user} className="w-11" />
      <div className="w-fit items-start h-full gap-1">
        <div className="flex items-center gap-1 text-base font-bold">
          <h3>{user.fullName}</h3>
          {user?.badge && <span>{findBadge(user?.badge)}</span>}
        </div>
        <div className="flex text-base-content/35 text-sm">
          <span>@{user.username}</span>
        </div>
        {showBio && <p className="text-neutral text-xs mt-2 overflow-ellipsis">
          {user?.bio}
        </p>}
      </div>
      {rightButton}
    </div>
  );
};

export default User;
