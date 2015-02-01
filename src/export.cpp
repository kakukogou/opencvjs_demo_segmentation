#include "segmentation.hpp"
#include "opencv2/imgproc/imgproc.hpp"

using namespace cv;

extern "C" {
void on_init(void const *source, int originalWidth, int originalHeight, int processWidth, int processHeight);
void on_mouse(int event, int x, int y, int flags, void* param);
void on_process(void *result, int width, int height);
}

extern void getBinMask( const Mat& comMask, Mat& binMask );

static GCApplication gcapp;

void on_init(void const *source, int originalWidth, int originalHeight, int processWidth, int processHeight)
{
    printf("on_init()+\n");

    cv::Mat frame_rgba_original(originalHeight, originalWidth, CV_8UC4, (unsigned char*)(source));
    cv::Mat frame_rgba;
    if (originalWidth != processWidth || originalHeight != processHeight) {
        cv::resize(frame_rgba_original, frame_rgba, cv::Size(processWidth, processHeight));
    }
    else {
        frame_rgba = frame_rgba_original;
    }

    cv::Mat frame_bgr;
    cv::cvtColor(frame_rgba, frame_bgr, cv::COLOR_RGBA2BGR);

    const string winName = "image";
    // namedWindow( winName, WINDOW_AUTOSIZE );
    gcapp.setImageAndWinName(frame_bgr, winName);

    printf("on_init(): frame_bgr.rows = %d, .cols = %d\n", frame_bgr.rows, frame_bgr.cols);
    printf("on_init()-\n");
}

void on_mouse(int event, int x, int y, int flags, void* param)
{
    printf("on_mouse(): %d, %d\n", x, y);
    gcapp.mouseClick( event, x, y, flags, param );
}

void on_process(void *result, int width, int height)
{
    printf("on_process(): w = %d, h = %d\n", width, height);
    gcapp.nextIter();

    // copy result back
    cv::Mat res;
    cv::Mat binMask;
    getBinMask( gcapp.mask, binMask );
    gcapp.image->copyTo( res, binMask );
    cv::cvtColor(res, res, cv::COLOR_BGR2RGBA);
    memcpy(result, res.data, width*height*4);

    unsigned char const *maskPtr = NULL;
    unsigned char *destPtr = NULL;
    for (int i = 0; i < height; ++i) {
        maskPtr = gcapp.mask.ptr(i);
        destPtr = (unsigned char*)result + i * width * 4;
        for (int j = 0; j < width; ++j) {
            *destPtr++ = 255;
            *destPtr++ = 0;
            *destPtr++ = 0;
            // *destPtr++ = 255;
            // printf("%u ", *maskPtr++);
            unsigned char c = *maskPtr++;
            if (c == GC_BGD || c == GC_PR_BGD) {
                *destPtr++ = 200;
            }
            else {
                *destPtr++ = 0;   
            }
        }
        // printf("\n");
    }
}