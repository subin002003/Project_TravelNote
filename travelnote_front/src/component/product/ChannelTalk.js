import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { useRecoilState } from "recoil";
import { loginEmailState, userNickState } from "../utils/RecoilData";
import { useEffect } from "react";

const ChannelTalk = () => {
  const [userNick, setUserNick] = useRecoilState(userNickState);
  const [userEmail, setUserEmail] = useRecoilState(loginEmailState);

  useEffect(() => {
    ChannelService.loadScript();

    ChannelService.boot({
      pluginKey: "61116c0a-6902-4a55-918d-bdd1a2a7d7ee", // fill your plugin key
      customLauncherSelector: ".channelTalkBtn",
      hideChannelButtonOnBoot: true,
      memberId: userEmail, // fill user's member id
      profile: {
        // fill user's profile
        name: userNick, // fill user's name
        email: userEmail,
      },
    });

    // Clean up function to shutdown ChannelService when component unmounts
    return () => {
      ChannelService.shutdown();
    };
  }, [userNick, userEmail]); // Add dependencies
  return null; // No UI component, so returning null
};

export default ChannelTalk;
