//
//  BaseLocationRequester.swift
//  ExpoLocation
//
//  Created by Jakov Glavina on 28.05.2024..
//

class BaseLocationRequester {
    func isConfiguredForWhenInUseAuthorization() -> Bool {
      return Bundle.main.object(forInfoDictionaryKey: "NSLocationWhenInUseUsageDescription") != nil
    }
  
  func isConfiguredForAlwaysAuthorization() -> Bool {
    return isConfiguredForWhenInUseAuthorization() && Bundle.main.object(forInfoDictionaryKey: "NSLocationAlwaysAndWhenInUseUsageDescription") != nil
  }
}
