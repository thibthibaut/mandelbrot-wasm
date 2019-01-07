#include <complex.h>
#include <stddef.h>

unsigned int mandelbrot(double re, double im, unsigned int iter, float zoom,
                        double xoffset, double yoffset) {

  re = (re - xoffset) / zoom;
  im = (im - yoffset) / zoom;
  double complex c = re + im * I;
  double complex z = 0 + 0 * I;
  double complex f_z = 0 + 0 * I;

  double ret = 0.0;

  for (size_t i = 0; i < iter; ++i) {
    f_z = z * z + c;
    ret = creal(f_z) * creal(f_z) + cimag(f_z) * cimag(f_z);

    if (ret > 10.0) {
      break;
    }
    z = f_z;
  }

  if (ret > 10.0) {
    return 255;
  }

  return 0;
}
