{
  "targets": [
    {
      "target_name": "binding",
      "sources": [
        "lib/fastgpio/module.cpp",
        "lib/fastgpio/fastgpioomega2.cpp",
        "lib/libnewgpio/src/TimeHelper.cpp",
        "src/SafeBuffer.cpp",
        "src/SafeQueue.cpp",
        "src/Renderer.cpp",
        "src/FREKVENS.cpp",
        "src/binding.cpp"
      ],
      "include_dirs": [
        "lib/fastgpio",
        "lib/libnewgpio/hdr",
        "src"
      ]
    }
  ]
}
