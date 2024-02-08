import { Component, OnInit } from '@angular/core';
import { detectIncognito } from "detectincognitojs";
import { ClientJS } from 'clientjs';

import { SharedService } from './shared.service';

// import { MaliceDetect }  from './utils/malicedetect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  incognitoResult: any
  fraudSummary = {
    fingerprint: 0,
    ip_address: '',
    incognito: false,
    user_agent: null,
    browser: {
      name: '',
      version: '',
    },
    timezone: '',
    language: '',
    max_touch_points: 0,
    plugins: '',

    os: {
      name: '',
      version: '',
    },
    geolocation: null,
    device: {
      type: '',
      vendor: '',
      name: '',
    },
    mobile: null,
    is_bot: false,
  }

  constructor(private sharedService: SharedService) {

  }

  ngOnInit(): void {
    // const maliceDetect = new MaliceDetect((result) => {
    //   console.log(result);
    // });
    
    // maliceDetect.init();
    this.sharedService.getIPAddress().subscribe(result => {
      this.fraudSummary.ip_address = result.ip;
    })

    detectIncognito().then((result) => {
      this.incognitoResult = result;
      this.fraudSummary.incognito = result.isPrivate;
      this.fraudSummary.browser.name = result.browserName;
    });
    
    const client = new ClientJS();
    this.fraudSummary.browser.version = client.getBrowserVersion();

    this.fraudSummary.os.name = client.getOS();
    this.fraudSummary.os.version = client.getOSVersion();

    this.fraudSummary.device.name = client.getDevice();
    this.fraudSummary.device.type = client.getDeviceType();
    this.fraudSummary.device.vendor = client.getDeviceVendor();
    
    this.fraudSummary.timezone = client.getTimeZone();
    this.fraudSummary.language = client.getLanguage();
    this.fraudSummary.user_agent = client.getUserAgent();

    if (client.isMobile()) {
      this.fraudSummary['mobile'] = {
        is_mobile_major: client.isMobileMajor(),
        is_mobile_android: client.isMobileAndroid(),
        is_mobile_opera: client.isMobileOpera(),
        is_mobile_windows: client.isMobileWindows(),
        is_mobile_blackBerry: client.isMobileBlackBerry(),
        is_mobile_ios: client.isMobileIOS(),
        is_iphone: client.isIphone(),
        is_ipad: client.isIpad(),
        is_ipod: client.isIpod(),
      }
    }

    this.fraudSummary.fingerprint = client.getFingerprint();
    this.fraudSummary.plugins = client.getPlugins();
    this.fraudSummary.max_touch_points = navigator.maxTouchPoints;
    
    const searchBots = /bot|crawler|spider|crawling|Daum|baiduspider|hubspot|googlebot|googlebot-mobile|SkypeUriPreview|UCCAPI|LinkedInBot|Embedly|Yahoo|YahooSeeker|DoCoMo|twitterbot|TweetmemeBot|Twikle|Netseer|Daumoa|SeznamBot|Ezooms|MSNBot|Exabot|MJ12bot|sogou\sspider|YandexBot|bitlybot|ia_archiver|proximic|spbot|ChangeDetection|NaverBot|MetaJobBot|magpie-crawler|Genieo\sWeb\sfilter|Qualidator.com\sBot|Woko|Vagabondo|360Spider|ExB\sLanguage\sCrawler|AddThis.com|aiHitBot|Spinn3r|BingPreview|GrapeshotCrawler|CareerBot|ZumBot|ShopWiki|bixocrawler|uMBot|sistrix|linkdexbot|AhrefsBot|archive.org_bot|SeoCheckBot|TurnitinBot|VoilaBot|SearchmetricsBot|Butterfly|Yahoo!|Plukkie|yacybot|trendictionbot|UASlinkChecker|Blekkobot|Wotbox|YioopBot|meanpathbot|TinEye|LuminateBot|FyberSpider|Infohelfer|linkdex.com|Curious\sGeorge|Fetch-Guess|ichiro|MojeekBot|SBSearch|WebThumbnail|socialbm_bot|SemrushBot|Vedma|alexa\ssite\saudit|SEOkicks-Robot|Browsershots|BLEXBot|woriobot|AMZNKAssocBot|Speedy|oBot|HostTracker|OpenWebSpider|WBSearchBot|facebookexternalhit|rogerbotpinterest|slackbot|Iframely|Ruby|WhatsApp|Mixmax-LinkPreview|bingbot|CloudFlare-AlwaysOnline|YandexMobileBot/i;
    this.fraudSummary.is_bot = searchBots.test(navigator.userAgent);


    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(this.showPosition)
    // }

    this.sharedService.getCurrentLocation().subscribe(
      (position: any) => {
        this.fraudSummary.geolocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      },
      (error: any) => {
        this.fraudSummary.geolocation = error.message;
      }
    );
  }

  showPosition(position: any) {
    console.log(position)
  }
}
