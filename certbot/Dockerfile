FROM certbot/certbot:v2.6.0

# 1) DNS-01 플러그인 설치
COPY certbot/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# 2) 호스트 secrets/duckdns.ini를 이미지에 복사
COPY secrets/duckdns.ini /etc/duckdns.ini

# 3) 이미지 내부에서 올바른 퍼미션 설정
RUN chmod 600 /etc/duckdns.ini
