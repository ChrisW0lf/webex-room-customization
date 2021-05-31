/**
 * @author Magnus Ohnm <mohm@cisco.com>, Christian Wolf <chriswol@cisco.com>
 * @copyright Copyright (c) 2021 Cisco and/or its affiliates.
 * @license Cisco Sample Code License, Version 1.1
 */

/**
 * @license
 * Copyright (c) 2021 Cisco and/or its affiliates.
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

function unsetGUIValue(guiId) {
    xapi.command('UserInterface Extensions Widget UnsetValue', {
        WidgetId: guiId
    });
}
 
function composePresentation(sources) {
    xapi.command('Presentation Start', {
        ConnectorId: sources,
        SendingMode: 'LocalRemote' // Options are LocalOnly or LocalRemote (which starts sharing imediately)
    }).catch(exception => {
        xapi.command('UserInterface Message TextLine Display', {
            Text: exception.message,
            duration: 3
        });
    });
}
function composeVideo(sources, parts) {
    const layout = (parts[2] === 'e') ? 'equal':'pip'
    xapi.command('Video Input SetMainVideoSource', {
        ConnectorId: sources,
        Layout: layout
    }).catch(exception => {
      xapi.command('UserInterface Message TextLine Display', {
        Text: exception.message,
        duration: 3
      });
    });
}
xapi.event.on('UserInterface Extensions Widget Action', event => {
    if (event.WidgetId.includes('_compositor') && event.Type === 'released') {
      switch (event.WidgetId.replace('_compositor', '')) {
        case 'stopPresentation':
          xapi.command('Presentation Stop')
          break;
        case 'presentation-s_1':
          const sourcecomboS1 = event.Value;
          composePresentation(sourcecomboS1);
          unsetGUIValue(event.WidgetId);
          break;
        case 'presentation-s_2_e_1':
          const sourcecomboS2E1 = event.Value.split('-');
          composePresentation(sourcecomboS2E1);
          unsetGUIValue(event.WidgetId);
          break;
        case 'presentation-s_2_e_2':
          const sourcecomboS2E2 = event.Value.split('-');
          composePresentation(sourcecomboS2E2);
          unsetGUIValue(event.WidgetId);
          break;
        case 'presentation-s_2_e_3':
          const sourcecomboS2E3 = event.Value.split('-');
          composePresentation(sourcecomboS2E3);
          unsetGUIValue(event.WidgetId);
          break;
        case 'presentation-s_3_e_1':
          const sourcecomboS3E1 = event.Value.split('-');
          composePresentation(sourcecomboS3E1);
          unsetGUIValue(event.WidgetId);
          break;
        case 'presentation-s_3_e_2':
          const sourcecomboS3E2 = event.Value.split('-');
          composePresentation(sourcecomboS3E2);
          unsetGUIValue(event.WidgetId);
          break;
        default:
          const parts = event.WidgetId.split('_');
          const videoSourceCombo = event.Value.split('-');
          composeVideo(videoSourceCombo,parts);
          unsetGUIValue(event.WidgetId);
      }
    }
});