OPENCV_INSTALL_DIR=/Users/kakukogou/MyLib/opencv/release_asm/install
OBJDIR=./bin

all:segmentation

segmentation: ../src/segmentation.cpp ../src/export.cpp
	mkdir -p $(OBJDIR)
	emcc \
	../src/segmentation.cpp \
	../src/export.cpp \
	-I $(OPENCV_INSTALL_DIR)/include \
	$(OPENCV_INSTALL_DIR)/lib/libopencv_core.so \
	$(OPENCV_INSTALL_DIR)/lib/libopencv_imgproc.so \
	-s EXPORTED_FUNCTIONS="['_on_mouse', '_on_init', '_on_process']" \
	-O3 \
	--llvm-lto 1 \
	--closure 1 \
	-s PRECISE_F32=1 \
	-s FORCE_ALIGNED_MEMORY=1 \
	-s TOTAL_MEMORY=306777216 \
	-o ./bin/segmentation.js

clean:
	rm ./bin/*.js ./bin/*.mem
	
install:
	rsync -rupE ./bin/*.js ../Demo_Segmentation_WebAPP/
	rsync -rupE ./bin/*.js.mem ../Demo_Segmentation_WebAPP/

.PHONY: install