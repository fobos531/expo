import CoreLocation

class ContactPickerControllerDelegate: NSObject, CLLocationManagerDelegate {
  private let watchId: Int?
  private let locationManager: CLLocationManager?

  var onUpdateLocations: (([CLLocation]) -> Void)?
  var onUpdateHeadings: ((CLHeading) -> Void)?
  var onError: ((Error) -> Void)?
    
  private let onContactPickingResultHandler: OnContactPickingResultHandler

  init(watchId: NSNumber?,
           locMgr: CLLocationManager,
           onUpdateLocations: (([CLLocation]) -> Void)?,
           onUpdateHeadings: ((CLHeading) -> Void)?,
           onError: ((Error) -> Void)?) {
          self.watchId = watchId
          self.locMgr = locMgr
          self.onUpdateLocations = onUpdateLocations
          self.onUpdateHeadings = onUpdateHeadings
          self.onError = onError
          super.init()
          self.locMgr.delegate = self
      }

  // Delegate method called by CLLocationManager
     func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
         if let onUpdateLocations = onUpdateLocations {
             onUpdateLocations(locations)
         }
     }

     func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
         if let onUpdateHeadings = onUpdateHeadings {
             onUpdateHeadings(newHeading)
         }
     }

     // Delegate method called by CLLocationManager
     func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
         if let onError = onError {
             onError(error)
         }
     }
}
