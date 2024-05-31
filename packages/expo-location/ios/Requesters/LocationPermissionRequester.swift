// Copyright 2022-present 650 Industries. All rights reserved.

import ExpoModulesCore

public class LocationPermissionRequester: NSObject, EXPermissionsRequester {
  let baseLocationRequester = BaseLocationRequester()
  
  
  static public func permissionType() -> String {
    return "location"
  }

  public func requestPermissions(resolver resolve: @escaping EXPromiseResolveBlock, rejecter reject: EXPromiseRejectBlock) {
    
    if (baseLocationRequester.isConfiguredForAlwaysAuthorization() && CLLocationManager().re)
  
      resolve(self.getPermissions());

  }

  public func getPermissions() -> [AnyHashable: Any] {
    var status: EXPermissionStatus
    
    var scope: String = "none"
   
      var systemStatus: CLAuthorizationStatus
      
      let locationWhenInUseDescription = Bundle.main.object(forInfoDictionaryKey: "NSLocationWhenInUseUsageDescription")
      let locationAlwaysAndWhenInUseDescription = Bundle.main.object(forInfoDictionaryKey: "NSLocationAlwaysAndWhenInUseUsageDescription")
      
      
    if #available(iOS 14, *) {
      if locationWhenInUseDescription ==  nil && locationAlwaysAndWhenInUseDescription == nil {
        EXFatal(EXErrorWithMessage("""
        One of the `NSLocation*UsageDescription` keys must be present in Info.plist to be able to use geolocation.
        """))
        systemStatus = .denied
      } else {
        systemStatus = CLLocationManager().authorizationStatus
      }

      switch systemStatus {
      case .authorizedWhenInUse:
        status = EXPermissionStatusGranted
        scope = "whenInUse"
      case .authorizedAlways:
        status = EXPermissionStatusGranted
        scope = "always"
      case .restricted,
           .denied:
        status = EXPermissionStatusDenied
      case .notDetermined:
        fallthrough
      @unknown default:
        status = EXPermissionStatusUndetermined
      }
  
    } else {
      status = EXPermissionStatusGranted
    }
      
      

    return [
      "status": status.rawValue,
      "scope": scope
    ]
  }
    
   
}
