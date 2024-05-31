//
//  LocationOptions.swift
//  ExpoLocation
//
//  Created by Jakov Glavina on 26.05.2024..
//

import Foundation
import ExpoModulesCore



struct LocationOptions: Record {
  @Field var accuracy: Int
  @Field var distanceInterval: Int
}

