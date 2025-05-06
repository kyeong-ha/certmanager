FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=-1

WORKDIR /web/backend

# ── 시스템 패키지 + 한/영 커스텀 폰트 ──
COPY ./utils/fonts /usr/share/fonts/truetype/custom/
RUN apt-get update && \
    apt-get install -y libreoffice fontconfig && \
    fc-cache -f -v

# ── 파이썬 의존성 ──
COPY ./requirements.txt .
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── 프로젝트 소스 ──
COPY . .

# ── 엔트리포인트 ──
COPY --chmod=755 ./entrypoint.sh .
RUN chmod +x /web/backend/entrypoint.sh
ENTRYPOINT ["sh", "/web/backend/entrypoint.sh"]