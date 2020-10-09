{
  "targets": [
    {
      "target_name": "driver",
      "sources": [
        "lib/fastgpio/module.cpp",
        "lib/fastgpio/fastgpioomega2.cpp",
        "src/OmegaDriver.cpp",
        "src/driver.cpp"
      ],
      "include_dirs": [
        "lib/fastgpio",
        "src"
      ]
    }
  ]
}
