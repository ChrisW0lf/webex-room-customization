const xapi = require('xapi');

function unsetGUIValue(guiId) {
    xapi.command('UserInterface Extensions Widget UnsetValue', {
        WidgetId: guiId
    });
}
 
function composePresentation(sources) {
    xapi.command('Presentation Start', {
        ConnectorId: sources,
        SendingMode: 'LocalRemote' // Options are LocalOnly or LocalRemote (which starts sharing imediately)
    }).catch(e => {
        xapi.command('UserInterface Message TextLine Display', {
            Text: e.message,
            duration: 3
        });
    });
}
function composeVideo(sources, parts) {
    const layout = (parts[2] === 'e') ? 'equal':'pip'
    xapi.command('Video Input SetMainVideoSource', {
        ConnectorId: sources,
        Layout: layout
    }).catch(e => {
      xapi.command('UserInterface Message TextLine Display', {
        Text: e.message,
        duration: 3
      });
    });
}
xapi.event.on('UserInterface Extensions Widget Action', e => {
    if (e.Type == 'released' && e.WidgetId.includes('_compositor')) {
      switch (e.WidgetId.replace('_compositor', '')) {
        case 'stopPresentation':
          xapi.command('Presentation Stop')
          break;
        case 'presentation-s_2_e_1':
          const sourcecomboS2E1 = e.Value.split('-');
          composePresentation(sourcecomboS2E1);
          unsetGUIValue(e.WidgetId);
          break;
        case 'presentation-s_2_e_2':
          const sourcecomboS2E2 = e.Value.split('-');
          composePresentation(sourcecomboS2E2);
          unsetGUIValue(e.WidgetId);
          break;
        case 'presentation-s_2_e_3':
          const sourcecomboS2E3 = e.Value.split('-');
          composePresentation(sourcecomboS2E3);
          unsetGUIValue(e.WidgetId);
          break;
        case 'presentation-s_3_e_1':
          const sourcecomboS3E1 = e.Value.split('-');
          composePresentation(sourcecomboS3E1);
          unsetGUIValue(e.WidgetId);
          break;
        case 'presentation-s_3_e_2':
          const sourcecomboS3E2 = e.Value.split('-');
          composePresentation(sourcecomboS3E2);
          unsetGUIValue(e.WidgetId);
          break;
        default:
          const parts = e.WidgetId.split('_');
          const videoSourceCombo = e.Value.split('-');
          composeVideo(videoSourceCombo,parts);
          unsetGUIValue(e.WidgetId);
      }
    }
});
 
//Author Magnus Ohm