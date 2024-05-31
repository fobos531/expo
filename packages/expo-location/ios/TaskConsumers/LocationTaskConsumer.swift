
import ExpoModulesCore


class LocationTaskConsumer: NSObject, EXTaskConsumerInterface {
  var locationManager: CLLocationManager;
  var deferredLocations: [CLLocation] = []
  var lastReportedLocation: CLLocation?
  var deferredDistance: CLLocationDistance = 0.0
  var task: EXTaskInterface?

  
  override init() {
    super.init()
    deferredDistance = 0.0
  }
  
  deinit {
    reset()
  }
  
  func taskType() -> String {
    return "location"
  }
  
  func didRegisterTask(_ task: EXTaskInterface) {
    self.task = task
  }
  
  func didUnregister() {
    reset()
  }
  
  func setOptions(_ options: [AnyHashable: Any]) {
     
   }
  
}
