import { glob, stream as globStream } from 'fast-glob';
import { vol } from 'memfs';
import { Readable } from 'stream';

import {
  matchNativePackageClassName,
  parseComponentDescriptorsAsync,
  parseLibraryNameAsync,
  parseNativePackageClassNameAsync,
  parsePackageNameAsync,
  resolveDependencyConfigImplAndroidAsync,
} from '../androidResolver';

jest.mock('fast-glob');
jest.mock('fs/promises');

describe(resolveDependencyConfigImplAndroidAsync, () => {
  const mockGlob = glob as jest.MockedFunction<typeof glob>;
  const mockGlobStream = globStream as jest.MockedFunction<typeof globStream>;

  afterEach(() => {
    jest.resetAllMocks();
    vol.reset();
  });

  it('should return android config if all native files found', async () => {
    // AndroidManifest.xml
    mockGlob.mockResolvedValueOnce(['src/main/AndroidManifest.xml']);
    // build.gradle
    mockGlob.mockResolvedValueOnce(['build.gradle']);
    // parseNativePackageClassNameAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from(['src/main/com/test/TestPackage.java']));
    // parseComponentDescriptorsAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from([]));

    vol.fromJSON({
      '/app/node_modules/react-native-test/package.json': JSON.stringify({ version: '1.0.0' }),
      '/app/node_modules/react-native-test/android/build.gradle': `
android {
    namespace "com.test"
    defaultConfig {
        applicationId "com.test"
    }
}
`,
      '/app/node_modules/react-native-test/android/src/main/AndroidManifest.xml': '',
      '/app/node_modules/react-native-test/android/src/main/com/test/TestPackage.java': `\
package com.test;

import com.facebook.react.ReactPackage;

public class TestPackage implements ReactPackage {
}
`,
    });
    const result = await resolveDependencyConfigImplAndroidAsync(
      '/app/node_modules/react-native-test',
      undefined
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "buildTypes": [],
        "cmakeListsPath": "/app/node_modules/react-native-test/android/build/generated/source/codegen/jni/CMakeLists.txt",
        "componentDescriptors": [],
        "cxxModuleCMakeListsModuleName": null,
        "cxxModuleCMakeListsPath": null,
        "cxxModuleHeaderName": null,
        "packageImportPath": "import com.test.TestPackage;",
        "packageInstance": "new TestPackage()",
        "sourceDir": "/app/node_modules/react-native-test/android",
      }
    `);
  });

  it('should return android config if gradle found but not AndroidManifest.xml', async () => {
    // AndroidManifest.xml
    mockGlob.mockResolvedValueOnce([]);
    // build.gradle
    mockGlob.mockResolvedValueOnce(['build.gradle']);
    // parseNativePackageClassNameAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from(['src/main/com/test/TestPackage.java']));
    // parseComponentDescriptorsAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from([]));

    vol.fromJSON({
      '/app/node_modules/react-native-test/package.json': JSON.stringify({ version: '1.0.0' }),
      '/app/node_modules/react-native-test/android/build.gradle': `
android {
    namespace "com.test"
    defaultConfig {
        applicationId "com.test"
    }
}
`,
      '/app/node_modules/react-native-test/android/src/main/com/test/TestPackage.java': `\
package com.test;

import com.facebook.react.ReactPackage;

public class TestPackage implements ReactPackage {
}
`,
    });
    const result = await resolveDependencyConfigImplAndroidAsync(
      '/app/node_modules/react-native-test',
      undefined
    );
    expect(result).not.toBeNull();
  });

  it('should return android config from custom sourceDir', async () => {
    // AndroidManifest.xml
    mockGlob.mockResolvedValueOnce([]);
    // build.gradle
    mockGlob.mockResolvedValueOnce(['build.gradle']);
    // parseNativePackageClassNameAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from(['src/main/com/test/TestPackage.java']));
    // parseComponentDescriptorsAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from([]));

    vol.fromJSON({
      '/app/node_modules/react-native-test/package.json': JSON.stringify({ version: '1.0.0' }),
      '/app/node_modules/react-native-test/custom/android/build.gradle': `
android {
    namespace "com.test"
    defaultConfig {
        applicationId "com.test"
    }
}
`,
      '/app/node_modules/react-native-test/custom/android/src/main/com/test/TestPackage.java': `\
package com.test;

import com.facebook.react.ReactPackage;

public class TestPackage implements ReactPackage {
}
`,
    });
    const result = await resolveDependencyConfigImplAndroidAsync(
      '/app/node_modules/react-native-test',
      {
        sourceDir: './custom/android',
      }
    );
    expect(result.sourceDir).toBe('/app/node_modules/react-native-test/custom/android');
  });

  it('should return null if gradle found but without namespace', async () => {
    // AndroidManifest.xml
    mockGlob.mockResolvedValueOnce([]);
    // build.gradle
    mockGlob.mockResolvedValueOnce(['build.gradle']);
    // parseNativePackageClassNameAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from(['src/main/com/test/TestPackage.java']));
    // parseComponentDescriptorsAsync()
    mockGlobStream.mockReturnValueOnce(Readable.from([]));

    vol.fromJSON({
      '/app/node_modules/react-native-test/package.json': JSON.stringify({ version: '1.0.0' }),
      '/app/node_modules/react-native-test/android/build.gradle': `
android {
    defaultConfig {
        applicationId "com.test"
    }
}
`,
      '/app/node_modules/react-native-test/android/src/main/com/test/TestPackage.java': `\
package com.test;

import com.facebook.react.ReactPackage;

public class TestPackage implements ReactPackage {
}
`,
    });
    const result = await resolveDependencyConfigImplAndroidAsync(
      '/app/node_modules/react-native-test',
      undefined
    );
    expect(result).toBeNull();
  });

  it('should return null if reactNativeConfig is null', async () => {
    const result = await resolveDependencyConfigImplAndroidAsync(
      '/app/node_modules/react-native-test',
      null
    );
    expect(result).toBeNull();
  });

  it('should return null if no gradle and AndroidManifest found', async () => {
    mockGlob.mockResolvedValue([]);
    const result = await resolveDependencyConfigImplAndroidAsync(
      '/app/node_modules/react-native-test',
      undefined
    );
    expect(result).toBeNull();
  });
});

describe(parsePackageNameAsync, () => {
  afterEach(() => {
    vol.reset();
  });

  it('should parse package name from build.gradle', async () => {
    vol.fromJSON({
      '/app/node_modules/test/src/main/AndroidManifest.xml': '',
      '/app/node_modules/test/build.gradle': `\
android {
    namespace "com.test"
    defaultConfig {
        applicationId "com.test"
    }
}
`,
    });
    const result = await parsePackageNameAsync(
      '/app/node_modules/test',
      'src/main/AndroidManifest.xml',
      'build.gradle'
    );
    expect(result).toEqual('com.test');
  });

  it('should parse package name from AndroidManifest.xml', async () => {
    vol.fromJSON({
      '/app/node_modules/test/src/main/AndroidManifest.xml': `\
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.test">
`,
      '/app/node_modules/test/build.gradle': '',
    });
    const result = await parsePackageNameAsync(
      '/app/node_modules/test',
      'src/main/AndroidManifest.xml',
      'build.gradle'
    );
    expect(result).toEqual('com.test');
  });
});

describe(parseNativePackageClassNameAsync, () => {
  const mockGlobStream = globStream as jest.MockedFunction<typeof globStream>;

  afterEach(() => {
    jest.resetAllMocks();
    vol.reset();
  });

  it('should parse component descriptors from java file', async () => {
    mockGlobStream.mockReturnValueOnce(Readable.from(['src/main/com/test/TestPackage.java']));
    vol.fromJSON({
      '/app/node_modules/test/android/src/main/com/test/TestPackage.java': `\
package com.test;

import com.facebook.react.ReactPackage;

public class TestPackage implements ReactPackage {
}
`,
    });

    const result = await parseNativePackageClassNameAsync(
      '/app/node_modules/test',
      '/app/node_modules/test/android'
    );
    expect(result).toEqual('TestPackage');
  });

  it('should parse component descriptors from kotlin file', async () => {
    mockGlobStream.mockReturnValueOnce(Readable.from(['src/main/com/test/TestPackage.kt']));
    vol.fromJSON({
      '/app/node_modules/test/android/src/main/com/test/TestPackage.kt': `\
package com.test

import com.facebook.react.ReactPackage

class TestPackage : ReactPackage {
}
`,
    });

    const result = await parseNativePackageClassNameAsync(
      '/app/node_modules/test',
      '/app/node_modules/test/android'
    );
    expect(result).toEqual('TestPackage');
  });
});

describe(parseLibraryNameAsync, () => {
  afterEach(() => {
    vol.reset();
  });

  it('should parse library name from package.json', async () => {
    const result = await parseLibraryNameAsync('/app/node_modules/test', {
      codegenConfig: {
        name: 'test',
      },
    });
    expect(result).toBe('test');
  });

  it('should parse library name from build.gradle', async () => {
    vol.fromJSON({
      '/app/node_modules/test/build.gradle': `\
ext {
  libraryName = "test"
}
`,
    });
    const result = await parseLibraryNameAsync('/app/node_modules/test', {});
    expect(result).toBe('test');
  });

  it('should parse library name from build.gradle.kts', async () => {
    vol.fromJSON({
      '/app/node_modules/test/build.gradle.kts': `\
ext {
  libraryName = "test"
}
`,
    });
    const result = await parseLibraryNameAsync('/app/node_modules/test', {});
    expect(result).toBe('test');
  });
});

describe(parseComponentDescriptorsAsync, () => {
  const mockGlobStream = globStream as jest.MockedFunction<typeof globStream>;

  afterEach(() => {
    jest.resetAllMocks();
    vol.reset();
  });

  it('should parse component descriptors', async () => {
    mockGlobStream.mockReturnValueOnce(
      Readable.from([
        'Test.ts',
        'SearchBarNativeComponent.js',
        'ScreenNativeComponent.ts',
        'specs/SpecComponent.ts',
        'node_modules/ScreenNested.tsx',
      ])
    );
    vol.fromJSON({
      // not matched: no `codegenNativeComponent` pattern
      '/app/node_modules/test/Test.ts': `export default {};`,
      // matched
      '/app/node_modules/test/SearchBarNativeComponent.js': `\
const test = {};
export default codegenNativeComponent('RNSSearchBar', {});
`,
      // not matched: interfaceOnly=true
      '/app/node_modules/test/ScreenNativeComponent.ts': `\
const test2 = {};
export default codegenNativeComponent<NativeProps>('RNSScreen', {
  interfaceOnly: true,
});
`,
      // matched
      '/app/node_modules/test/specs/SpecComponent.ts': `\
export default codegenNativeComponent<NativeProps>('RNSpec', {});
`,
      // not matched: nested in node_modules
      '/app/node_modules/test/node_modules/ScreenNested.tsx': `\
export default codegenNativeComponent<NativeProps>('RNSSearchBar', {});
`,
    });

    const results = await parseComponentDescriptorsAsync('/app/node_modules/test', {});
    expect(results).toEqual(['RNSSearchBarComponentDescriptor', 'RNSpecComponentDescriptor']);
  });

  describe(matchNativePackageClassName, () => {
    const path = 'unused';

    it.each([
      {
        description: 'Java class implementing ReactPackage',
        content: `
import com.facebook.react.ReactPackage;

public class CustomReactPackage implements ReactPackage {
}`,
      },
      {
        description: 'Kotlin class implementing ReactPackage',
        content: `
import com.facebook.react.ReactPackage

class CustomReactPackage : ReactPackage {
}`,
      },
      {
        description: 'class implementing ReactPackage with additional interfaces',
        content: `
import com.facebook.react.ReactPackage;

public class CustomReactPackage implements ReactPackage, SomeOtherInterface {
}`,
      },
      {
        description: 'Java class extending BaseReactPackage',
        content: `
import com.facebook.react.BaseReactPackage;

public class CustomReactPackage extends BaseReactPackage {
}`,
      },
      {
        description: 'Java class extending TurboReactPackage',
        content: `
import com.facebook.react.TurboReactPackage;

public class CustomReactPackage extends TurboReactPackage {
}`,
      },
      {
        description: 'Kotlin class extending BaseReactPackage',
        content: `
import com.facebook.react.BaseReactPackage

class CustomReactPackage : BaseReactPackage() {
}`,
      },
      {
        description: 'Kotlin class extending TurboReactPackage',
        content: `
import com.facebook.react.TurboReactPackage

class CustomReactPackage : TurboReactPackage() {
}`,
      },
    ])('should handle $description', ({ content }) => {
      expect(matchNativePackageClassName(path, Buffer.from(content))).toBe('CustomReactPackage');
    });

    // these are not as exhaustive as they could be, but cover main cases
    it.each([
      {
        description: 'class without any ReactPackage implementation',
        content: `
public class CustomReactPackage {
}`,
      },
      {
        description: 'class without any ReactPackage implementation 2',
        content: `
public class CustomReactPackage extends SomeOtherPackage {
}`,
      },
      {
        description: 'empty file',
        content: '',
      },
    ])('should return null for $description', ({ content }) => {
      expect(matchNativePackageClassName(path, Buffer.from(content))).toBeNull();
    });
  });
});
