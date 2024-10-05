import {User} from "../../../Model/User.model";

const findLocation = (roomId: string, user: User | null) => {
  return user?.gateways.filter(value => `${value.countryId}${value.areaId}${value.gatewayId}` === roomId)[0];
};

export default findLocation;