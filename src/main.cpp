#include "opencv2/imgcodecs.hpp"
#include "opencv2/imgproc.hpp"
#include "opencv2/highgui/highgui.hpp"

extern "C" {
extern void test_segmentation(void const *source, void *deatination, int width, int height,
					   int x0, int y0, int x1, int y1);
}

int main(void) {

	cv::Mat image = cv::imread("/Users/kakukogou/Desktop/TWOINCH.jpg");
	cv::Mat result(image.size(), CV_8UC4);

	cv::Rect rect(cv::Point(55, 65), cv::Point(385, 550));

	cv::Mat imageShow = image.clone();
	cv::rectangle(imageShow, rect, cv::Scalar(255,0,0), 5);
	//cv::resize(imageShow, imageShow, cv::Size(), 0.5, 0.5);

	cv::imshow("source", imageShow);
	cv::waitKey(0);

	cv::Mat image_rgba;
	cv::cvtColor(image, image_rgba, cv::COLOR_BGR2RGBA);
	
	clock_t c = clock();
	test_segmentation(image_rgba.data, result.data, image.cols, image.rows, 
		rect.x, rect.y, rect.x+rect.width-1, rect.y+rect.height-1);
	printf("test_segmentation(): %f ms\n", ((float)(clock() - c)*1000.0f/CLOCKS_PER_SEC));


	cv::cvtColor(result, result, cv::COLOR_RGBA2BGR);
	//cv::resize(res, res, cv::Size(), 0.5, 0.5);
	cv::imshow("result", result);
	cv::waitKey(0);

	return 0;
}