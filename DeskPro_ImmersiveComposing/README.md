# ImmersiveComposing
### Turn your Cisco Webex DeskPro into a home video studio.

With this setup you will be able to flexibly decide what you want to show or share.
Choose between different sources and layouts to get the desired output.
With the immersive video part you will be even much more flexible.

---
### Choose the video sources and layout you want to show: 
![Video Page](https://github.com/ChrisW0lf/webex-room-customization/blob/main/DeskPro_ImmersiveComposing/images/videoComposing.png)

### Choose the presentation sources and layout you want to share: 
![Presentation Page](https://github.com/ChrisW0lf/webex-room-customization/blob/main/DeskPro_ImmersiveComposing/images/presentationComposing.png)

### Enrich the experience with immersive settings: 
![Immersive settings](https://github.com/ChrisW0lf/webex-room-customization/blob/main/DeskPro_ImmersiveComposing/images/immersiveVideo.png)
---

## Requirements
1. Cisco Webex DeskPro
2. Firmware CE9.15 or newer
4. Admin user access to endpoint

## Setup
1. Import the UI file **[DeskPro_ImmersiveComposing.xml](https://github.com/ChrisW0lf/webex-room-customization/blob/main/DeskPro_ImmersiveComposing/DeskPro_ImmersiveComposing.xml)** to the **UI Extensions Editor** of your DeskPro and **Export configuration to video system**.
2. Import the macro file **[DeskPro_ImmersiveComposing.js](https://github.com/ChrisW0lf/webex-room-customization/blob/main/DeskPro_ImmersiveComposing/DeskPro_ImmersiveComposing.js)** to the **Macro Editor** of your DeskPro and **Save to System**.
3. To get the **immersive capabilites** import the macro file **[DeskPro_ImmersiveVideo.js](https://github.com/ChrisW0lf/webex-room-customization/blob/main/DeskPro_ImmersiveVideo/DeskPro_ImmersiveVideo.js)** to the **Macro Editor**, too.

## Support&Feedback
Please join this **[Webex Space](https://eurl.io/#Fvo7JcAkQ)** if you need support, have questions or to start some discussions around the macro or functionality:
![QRCodeToWebexSpace](https://github.com/ChrisW0lf/webex-room-customization/blob/main/DeskPro_ImmersiveComposing/images/webexSpaceQR.png)

## Disclaimer
Those examples are only samples and are **NOT guaranteed to be bug free and production quality**.

The sample macros are meant to:
- Illustrate how to use the CE Macros.
- Serve as an example of the step by step process of building a macro using JavaScript and integration with the Codec XAPI.

The sample macros are made available to Cisco partners and customers as a convenience to help minimize the cost of Cisco Finesse customizations. Cisco does not permit the use of this library in customer deployments that do not include Cisco Video Endpoint Hardware.
