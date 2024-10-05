export interface ControllerSpecification {
  id: number,
  min: number,
  max: number,
  step: number,
  unit: string,
  name: string,
  varName: string,
  description: string,
  controllerType: string,
  useYn: boolean,
}