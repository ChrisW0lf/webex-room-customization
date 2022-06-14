/**
 * @author Christian Wolf <chriswol@cisco.com>
 * @copyright Copyright (c) 2022 Cisco and/or its affiliates.
 * @license Cisco Sample Code License, Version 1.1
 */

/**
 * @license
 * Copyright (c) 2022 Cisco and/or its affiliates.
 *
 * This software is licensed to you under the terms of the Cisco Sample
 * Code License, Version 1.1 (the "License"). You may obtain a copy of the
 * License at
 *
 *                https://developer.cisco.com/docs/licenses
 *
 * All use of the material herein must be in accordance with the terms of
 * the License. All rights not expressly granted by the License are
 * reserved. Unless required by applicable law or agreed to separately in
 * writing, software distributed under the License is distributed on an "AS
 * IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied.
 */

import xapi from 'xapi';

let cameraLidState;
let backgroundImage;
let backgroundMode;
let muteStatus;
let beRightBack = false;

async function getInitialSettings() {
  backgroundImage = await xapi.Status.Cameras.Background.Image.get();
  backgroundMode = await xapi.Status.Cameras.Background.Mode.get();
  cameraLidState = await xapi.Status.SystemUnit.State.CameraLid.get();
};

async function getMuteStatus() {
  muteStatus = await xapi.Status.Audio.Microphones.Mute.get();
};

xapi.on('ready', () => {
  getInitialSettings();
});

// Event for Camera lid changes
xapi.status.on('SystemUnit State CameraLid', (status) => {
  cameraLidState = status;
});

// Event if Background Image or Mode has been changed
xapi.status.on('Cameras Background', (event) => {
  if (!beRightBack) {
    if (event['Image']) {backgroundImage = event['Image']; }
    else {backgroundMode = event['Mode']; };
  };
});

// Event if PeopleCount changes
xapi.status.on('RoomAnalytics PeopleCount Current', (count) => {
  if (count === '0' && cameraLidState === 'Open') {
    getMuteStatus();
    beRightBack = true;
    xapi.command('Cameras Background Set', { Image: 'User1', Mode: 'Image'});
    xapi.command('Audio Microphones Mute');
  }
  else if (count === '1') {
    beRightBack = false;
    if (backgroundMode === 'Image') { xapi.command('Cameras Background Set', { Image: backgroundImage, Mode: backgroundMode }); }
    else {xapi.command('Cameras Background Set', { Mode: backgroundMode }); };
    if (muteStatus == 'Off') {xapi.command('Audio Microphones Unmute');};
  };
});