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
    <div className="grid grid-cols-[auto_1fr_auto] items-center w-full h-fit gap-3">
      <Avatar user={user} className="w-10 h-10" />
      <div className="w-fit items-center h-full gap-1">
        <h2 className="flex items-center gap-1 text-sm xs:text-sm font-bold">
          {user.fullName}
          {user?.badge && <span>{findBadge(user?.badge)}</span>}
        </h2>
        <span className="flex text-base-content/35 text-sm">
          @{user.username}
        </span>
        {showBio && (
          <p className="text-neutral text-xs mt-2 overflow-ellipsis">
            {user?.bio}
          </p>
        )}
      </div>
      {rightButton}
    </div>
  );
};

export default User;
