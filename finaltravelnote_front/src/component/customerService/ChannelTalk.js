import React, { useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { useRecoilState } from "recoil";
import { loginEmailState, userNickState } from "../utils/RecoilData";

const ChannelTalk = () => {
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [userEmail, serUserEmail] = useRecoilState(loginEmailState);
  useEffect(() => {
    ChannelService.loadScript();

    //3. 부트하기
    ChannelService.boot({
      pluginKey: "61116c0a-6902-4a55-918d-bdd1a2a7d7ee",
      customLauncherSelector: ".channelTalk-btn",
      hideChannelButtonOnBoot: true,
      memberId: userEmail,
      profile: {
        name: userNick,
        email: userEmail,
      },
    });

    return () => {
      // 컴포넌트 언마운트 시 ChannelIO 종료
      ChannelService.shutdown();
    };
  }, [userEmail, userNick]);
  return <></>;
};

export default ChannelTalk;
