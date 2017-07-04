#!/usr/bin/env bash
echo "-------- Installing Flite TTS ---------"

wget http://www.festvox.org/flite/packed/flite-2.0/flite-2.0.0-release.tar.bz2
tar xf flite-2.0.0-release.tar.bz2
cd flite-2.0.0-release
./configure
make
sudo make install
cd ..

echo "------- Installing Flite TTS Voices -------"

cd ./resources/

if [ ! -f "cmu_us_slt.flitevox" ]
then
    wget http://www.festvox.org/flite/packed/flite-2.0/voices/cmu_us_slt.flitevox
else
    echo "Voice Already present. Skipping"
fi

echo "------- Flite Install Completed --------"

