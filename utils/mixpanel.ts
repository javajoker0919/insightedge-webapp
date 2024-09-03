import mixpanel, { Dict, Query } from "mixpanel-browser";

let mixpanelInstance: MixPanel | null = null;

export const getMixPanelClient = () => {
  if (!mixpanelInstance) {
    mixpanelInstance = new MixPanel();
  }
  return mixpanelInstance;
};

class MixPanel {
  constructor() {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? "";
    mixpanel.init(token, {
      track_pageview: true,
      persistence: "localStorage",
      // api_host: process.env.NEXT_PUBLIC_MIXPANEL_API ?? "",
    });
  }

  identify(id: string) {
    mixpanel.identify(id);
  }

  alias(id: string) {
    mixpanel.alias(id);
  }

  track(event: string, props?: Dict) {
    const trackEnabled = !process.env.NEXT_PUBLIC_TRACK_DISABLED ?? true;

    if (trackEnabled) {
      mixpanel.track(event, props);
    }
  }

  track_links(query: Query, name: string) {
    mixpanel.track_links(query, name, {
      referrer: document.referrer,
    });
  }

  set(props: Dict) {
    mixpanel.people.set(props);
  }
}

export default MixPanel;
