# opencvjs_demo_segmentation

## Download and build opencv.js
[OpenCV.js installation guild](https://github.com/kakukogou/opencv/tree/opencvjs)

## Compile

### Download this repository
<pre>
git clone https://github.com/kakukogou/opencvjs_demo_segmentation.git
cd opencvjs_demo_segmentation
cd emscripten_build
</pre>

### Set the installation folder of OpenCV.js
In **Makefile**
<pre>
OPENCV_INSTALL_DIR=<your_opencvjs_local_repository>/release_asm/install
</pre>

### Build
<pre>
make
make install
</pre>

### Run
Open your Firefox and load *opencvjs_demo_segmentation/Demo_Segmentation_WebAPP/index.html*
