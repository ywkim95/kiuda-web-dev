import Controller from "./Controller";
import {Device} from "../../../Common/Model/Device.model";
import {useSettingStore} from "../../../Common/Store/settingStore";


const Controllers = ({value}: { value: Device }) => {
  const setting = useSettingStore(state => state.setting);
  
  return (
    <div className="sensor" key={value.id}>
      {
        [0, 1, 2, 3].map((indexedValue, index) => {
          if (value.controllers![index] === undefined) {
            return (
              <div key={indexedValue}></div>
            )
          } else {
            const controller = value.controllers![index];
            const sensorDevice = setting.find(value => value.id === controller.connectedDeviceId);
            if(sensorDevice === undefined) return null;
            return (
              <Controller
                deviceId={value.id}
                controllerDevice={controller}
                sensorDevice={sensorDevice!}
                key={controller.id}
              />
            )
          }
          
        })
      }
    </div>
  );
};

export default Controllers;
