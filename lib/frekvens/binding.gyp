{
  "targets": [
    {
      "target_name": "driver",
      "sources": [
        "lib/fastgpio/module.cpp",
        "lib/fastgpio/fastgpioomega2.cpp",
        "lib/libnewgpio/src/TimeHelper.cpp",
        "src/RenderBuffer.cpp",
        "src/EventQueue.cpp",
        "src/OmegaDriver.cpp",
        "src/driver.cpp"
      ],
      "include_dirs": [
        "lib/fastgpio",
        "lib/libnewgpio/hdr",
        "src"
      ]
    }
  ]
}
