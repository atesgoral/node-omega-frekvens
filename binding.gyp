{
  "targets": [
    {
      "target_name": "binding",
      "sources": [
        "lib/fastgpio/module.cpp",
        "lib/fastgpio/fastgpioomega2.cpp",
        "lib/libnewgpio/src/TimeHelper.cpp",
        "src/RenderBuffer.cpp",
        "src/EventQueue.cpp",
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
