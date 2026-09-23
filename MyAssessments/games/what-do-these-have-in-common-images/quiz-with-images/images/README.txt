Drop your PNG files in this folder using these exact filenames
(one per icon used in the quiz rounds):

  sun.png
  moon.png
  cat.png
  dog.png
  apple.png
  banana.png
  car.png
  bicycle.png
  guitar.png
  piano.png

Each image is displayed inside a fixed-size frame and scaled to fit
without cropping (object-fit: contain), so any reasonable image size
or aspect ratio works fine — square images will center most cleanly.

To use different images/subjects than the ones above, edit the
PUZZLE_ROUNDS array near the top of index.html's <script> block:
each round's "icons" array names two files (by key, without ".png")
that should exist in this folder, and "choices"/"answer" define the
4 multiple-choice options and the correct one.
