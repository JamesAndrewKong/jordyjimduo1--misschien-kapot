# Use the official Prometheus Docker image
FROM prom/prometheus:v2.30.3

# Copy the Prometheus configuration file into the container
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Expose the Prometheus port
EXPOSE 9090